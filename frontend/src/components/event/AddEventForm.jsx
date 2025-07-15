import React, { useState } from 'react';
import {
  Form, Input, DatePicker, TimePicker, Button, Upload, Radio, message, Select, notification, InputNumber
} from 'antd';
import { InboxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../service/supabaseClient';

const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;

const AddEventForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventType, setEventType] = useState('in_person');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [hasMerchandise, setHasMerchandise] = useState(false);
  const [selectedMerchTypes, setSelectedMerchTypes] = useState([]);
  const [merchandiseData, setMerchandiseData] = useState({});

  const navigate = useNavigate();

  const showSuccessNotification = (eventName, isPublic) => {
    notification.success({
      message: 'Event Created Successfully! ',
      description: (
        <div>
          <p><strong>{eventName}</strong> has been created and is now {isPublic ? 'publicly available' : 'private to AIESEC members'}.</p>
          <p>Your event is ready to receive registrations!</p>
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
            images: [...(prev[type]?.images || []), { url, uid: file.uid }],
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
        registrationCloseBeforeDays: values.registrationCloseBeforeDays,
        hasMerchandise, 
        merchandise: selectedMerchTypes.map((type) => ({
          type,
          description: merchandiseData[type]?.description || '',
          images: merchandiseData[type]?.images?.map((img) => img.url) || [],
          available: true,
        })),
      };

      const response = await axios.post('http://localhost:8080/api/events', payload);
      const eventId = response.data.eventId;

      if (hasMerchandise && selectedMerchTypes.length > 0) {
        const merchandisePromises = selectedMerchTypes.map(async (type) => {
          const merch = merchandiseData[type];
          const merchPayload = {
            eventId,
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
      
      form.resetFields();
      setEventImageUrl('');
      setHasMerchandise(false);
      setSelectedMerchTypes([]);
      setMerchandiseData({});

      navigate(values.visibility === 'public' ? `/public-event` : `/event/${eventId}`);
    } catch (error) {
      console.error('Error creating event:', error);
     
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl px-6 py-8 mx-auto mt-6 sm:mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Create New Event</h2>
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

        <Form.Item 
          name="registrationCloseBeforeDays" 
          label="Registration Close Before (Days)" 
          rules={[
            { required: true, message: 'Please enter the number of days before the event when registration closes' },
            { type: 'number', min: 0, max: 365, message: 'Value must be between 0 and 365 days' }
          ]}
        >
          <InputNumber 
            className="w-full" 
            min={0} 
            max={365} 
            placeholder="Enter number of days (0-365)"
            addonAfter="days"
          />
        </Form.Item>

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
            Create Event
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEventForm;