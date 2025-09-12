import React, { useEffect, useState } from 'react';
import {
  Form, Input, DatePicker, TimePicker, Button, Upload, Radio, message, Select, notification
} from 'antd';
import { InboxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../service/supabaseClient';

const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;

const EditEvent = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventType, setEventType] = useState('in_person');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [hasMerchandise, setHasMerchandise] = useState(false);
  const [selectedMerchTypes, setSelectedMerchTypes] = useState([]);
  const [merchandiseData, setMerchandiseData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const showSuccessNotification = (eventName, isPublic) => {
    notification.success({
      message: 'Event Updated Successfully! 🎉',
      description: (
        <div>
          <p><strong>{eventName}</strong> has been updated and is now {isPublic ? 'publicly available' : 'private to AIESEC members'}.</p>
          <p>Your changes have been saved!</p>
        </div>
      ),
      placement: 'topRight',
      duration: 4,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      style: {
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    });
  };

  // Fetch event data on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:8080/api/events/${id}`);
        
        if (data) {
          setEventImageUrl(data.imageUrl || '');
          setEventType(data.isVirtual ? 'virtual' : 'in_person');
          setHasMerchandise(data.hasMerchandise || false);
          
          // Set form values
          form.setFieldsValue({
            eventName: data.eventName,
            description: data.description,
            startDate: moment(data.startDate),
            endDate: moment(data.endDate),
            startTime: moment(data.eventTime, 'hh:mm A'),
            endTime: moment(data.endTime, 'hh:mm A'),
            location: data.isVirtual ? data.virtualLink : data.location,
            visibility: data.isPublic ? 'public' : 'private',
          });

          // Fetch merchandise data if available
          if (data.hasMerchandise) {
            try {
              const merchResponse = await axios.get(`http://localhost:8080/api/merchandise/event/${id}`);
              if (merchResponse.data && merchResponse.data.length > 0) {
                const merchTypes = [...new Set(merchResponse.data.map(item => item.type))]; // Remove duplicates
                const merchData = {};
                
                merchResponse.data.forEach(item => {
                  if (!merchData[item.type]) {
                    merchData[item.type] = {
                      description: item.description,
                      images: item.images.map((url, index) => ({
                        uid: `${item.type}-${index}-${Date.now()}`,
                        name: `${item.type}-image-${index}`,
                        url: url,
                        status: 'done',
                        thumbUrl: url
                      }))
                    };
                  }
                });
                
                setSelectedMerchTypes(merchTypes);
                setMerchandiseData(merchData);
              }
            } catch (merchError) {
              console.warn('No merchandise found for this event');
            }
          }
        }
      } catch (err) {
        console.error(err);
        message.error('Failed to load event.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, form]);

  const uploadFile = async (file) => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const bucketName = 'eventimages';

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        console.error('Upload error details:', error);
        message.error(`Upload failed: ${error.message}`);
        return '';
      }

      const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      message.error('Unexpected upload error');
      console.error('Upload exception:', err);
      return '';
    }
  };

  const handleEventImageUpload = async (file) => {
    const url = await uploadFile(file);
    if (url) setEventImageUrl(url);
    return false;
  };

  const handleMerchImagesUpload = async (type, { file, onSuccess, onError }) => {
    try {
      if (file.status === 'removed') return;

      const url = await uploadFile(file);
      if (url) {
        setMerchandiseData((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            images: [...(prev[type]?.images || []), { 
              url, 
              uid: file.uid || `${type}-${Date.now()}`, 
              status: 'done',
              name: file.name,
              thumbUrl: url
            }],
          },
        }));
        onSuccess && onSuccess();
      } else {
        onError && onError(new Error('Upload failed'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError && onError(error);
    }
  };

  const handleMerchTypeChange = (values) => {
    setSelectedMerchTypes(values);
    
    // Create updated merchandise data with only selected types
    const updated = {};
    values.forEach(type => {
      updated[type] = merchandiseData[type] || { description: '', images: [] };
    });
    
    // Remove data for unselected types
    setMerchandiseData(updated);
  };

  const handleDescriptionChange = (type, value) => {
    setMerchandiseData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        description: value,
        images: prev[type]?.images || []
      }
    }));
  };

  const handleImageRemove = (type, file) => {
    setMerchandiseData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        images: prev[type]?.images?.filter((img) => img.uid !== file.uid) || []
      }
    }));
  };

  const disabledDate = (current) => current && current < moment().startOf('day');

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);

      if (moment(values.endDate).isBefore(values.startDate, 'day')) {
        message.error('End date must be same or after start date.');
        setIsSubmitting(false);
        return;
      }

      if (
        moment(values.startDate).isSame(values.endDate, 'day') &&
        moment(values.endTime).isBefore(values.startTime)
      ) {
        message.error('End time must be after start time.');
        setIsSubmitting(false);
        return;
      }

      if (hasMerchandise && selectedMerchTypes.length > 0) {
        const invalidItems = selectedMerchTypes.filter((type) => {
          const data = merchandiseData[type];
          return !data || !data.description?.trim() || !data.images || data.images.length === 0;
        });

        if (invalidItems.length > 0) {
          message.error(`Please complete all selected merchandise items: ${invalidItems.join(', ')}`);
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        eventName: values.eventName,
        description: values.description,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        eventTime: values.startTime.format('hh:mm A'),
        endTime: values.endTime.format('hh:mm A'),
        imageUrl: eventImageUrl,
        isPublic: values.visibility === 'public',
        isVirtual: eventType === 'virtual',
        location: eventType === 'virtual' ? '' : values.location,
        virtualLink: eventType === 'virtual' ? values.location : '',
        hasMerchandise,
        merchandise: selectedMerchTypes.map((type) => ({
          type,
          description: merchandiseData[type]?.description || '',
          images: merchandiseData[type]?.images?.map((img) => img.url) || [],
          available: true,
        })),
      };

      // Update the event
      await axios.put(`http://localhost:8080/api/events/${id}`, payload);

      // Delete all existing merchandise for this event
      try {
        await axios.delete(`http://localhost:8080/api/merchandise/event/${id}`);
      } catch (error) {
        console.warn('No existing merchandise to delete');
      }

      // Add new merchandise if any
      if (hasMerchandise && selectedMerchTypes.length > 0) {
        const merchandisePromises = selectedMerchTypes.map(async (type) => {
          const merch = merchandiseData[type];
          const merchPayload = {
            eventId: id,
            type,
            description: merch.description.trim(),
            images: merch.images.map((img) => img.url),
            available: true,
          };
          return axios.post('http://localhost:8080/api/merchandise', merchPayload);
        });

        await Promise.all(merchandisePromises);
      }

      showSuccessNotification(values.eventName, values.visibility === 'public');
      navigate(`/event/${id}`);
    } catch (error) {
      console.error('Error updating event:', error);
      message.error('❌ Failed to update event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl px-6 py-8 mx-auto mt-6 sm:mt-10">
        <div className="text-center">Loading event data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl px-6 py-8 mx-auto mt-6 sm:mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Edit Event</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ visibility: 'private', eventType: 'in_person' }}
      >
        <Form.Item name="eventName" label="Event Title" rules={[{ required: true }]}>
          <Input placeholder="Enter event title" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Describe the event" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" disabledDate={disabledDate} />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
            <TimePicker use12Hours format="h:mm A" className="w-full" />
          </Form.Item>
          <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
            <TimePicker use12Hours format="h:mm A" className="w-full" />
          </Form.Item>
        </div>

        <Form.Item label="Event Type">
          <Radio.Group 
            value={eventType} 
            onChange={(e) => setEventType(e.target.value)} 
            className="flex gap-6"
          >
            <Radio value="in_person">In Person</Radio>
            <Radio value="virtual">Virtual</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item 
          name="location" 
          label={eventType === 'virtual' ? 'Meeting Link' : 'Location'} 
          rules={[{ required: true }]}
        >
          <Input placeholder={eventType === 'virtual' ? 'Enter meeting link' : 'Enter event location'} />
        </Form.Item>

        <Form.Item label="Event Image" required>
          <Dragger
            multiple={false}
            maxCount={1}
            beforeUpload={handleEventImageUpload}
            showUploadList={false}
            accept="image/*"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to upload</p>
          </Dragger>
          {eventImageUrl && (
            <img src={eventImageUrl} alt="Uploaded preview" className="mt-4 w-48 rounded shadow" />
          )}
        </Form.Item>

        <Form.Item label="Merchandise Available?">
          <Radio.Group
            onChange={(e) => {
              const value = e.target.value === 'yes';
              setHasMerchandise(value);
              if (!value) {
                setSelectedMerchTypes([]);
                setMerchandiseData({});
              }
            }}
            value={hasMerchandise ? 'yes' : 'no'}
            className="flex gap-8"
          >
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>

        {hasMerchandise && (
          <>
            <Form.Item label="Select Merchandise Items">
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select items (e.g., T-Shirt, Cap)"
                onChange={handleMerchTypeChange}
                value={selectedMerchTypes}
              >
                {['T-Shirt', 'Cap', 'Wristband', 'Hoodie', 'Mug', 'Sticker', 'Bag', 'Other'].map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>

            {selectedMerchTypes.map((type) => (
              <div key={type} className="mb-6 border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">{type}</h3>

                <Form.Item label={`${type} Description`}>
                  <TextArea
                    rows={3}
                    placeholder={`Enter description for ${type}`}
                    value={merchandiseData[type]?.description || ''}
                    onChange={(e) => handleDescriptionChange(type, e.target.value)}
                  />
                </Form.Item>

                <Form.Item label={`Upload ${type} Images`}>
                  <Upload
                    listType="picture"
                    multiple
                    accept="image/*"
                    fileList={merchandiseData[type]?.images || []}
                    onRemove={(file) => handleImageRemove(type, file)}
                    customRequest={({ file, onSuccess, onError }) =>
                      handleMerchImagesUpload(type, { file, onSuccess, onError })
                    }
                  >
                    <Button icon={<InboxOutlined />}>Upload Images</Button>
                  </Upload>
                </Form.Item>
              </div>
            ))}
          </>
        )}

        <Form.Item 
          name="visibility" 
          label="Event Visibility" 
          rules={[{ required: true }]}
        >
          <Radio.Group className="flex gap-6">
            <Radio value="private">Private (AIESEC members only)</Radio>
            <Radio value="public">Public (Guests can register)</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isSubmitting} 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Update Event
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditEvent;