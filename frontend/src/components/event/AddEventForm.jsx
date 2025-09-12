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

  // Custom validation functions
  const validateEndDate = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    
    const startDate = form.getFieldValue('startDate');
    if (!startDate) {
      return Promise.resolve();
    }
    
    console.log('Validating dates:', {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: value.format('YYYY-MM-DD'),
      isBefore: moment(value).isBefore(moment(startDate), 'day')
    });
    
    // Check if end date is before start date
    if (moment(value).isBefore(moment(startDate), 'day')) {
      console.log('Validation failed: End date is before start date');
      return Promise.reject(new Error('End date must be same or after start date'));
    }
    
    console.log('Validation passed');
    return Promise.resolve();
  };



  const validateEventImage = (_, value) => {
    if (!eventImageUrl) {
      return Promise.reject(new Error('Please upload an event image'));
    }
    return Promise.resolve();
  };

  const validateMerchandise = () => {
    if (!hasMerchandise || selectedMerchTypes.length === 0) {
      return Promise.resolve();
    }

    const invalidItems = selectedMerchTypes.filter((type) => {
      const data = merchandiseData[type];
      return !data || !data.description?.trim() || !data.images || data.images.length === 0;
    });

    if (invalidItems.length > 0) {
      return Promise.reject(new Error(`Please complete all selected merchandise items: ${invalidItems.join(', ')}`));
    }
    
    return Promise.resolve();
  };

  // Handle form field changes to trigger re-validation
  const handleStartDateChange = (date) => {
    // Clear end date if it's now invalid
    const endDate = form.getFieldValue('endDate');
    if (endDate && date && moment(endDate).isBefore(moment(date), 'day')) {
      form.setFieldsValue({ endDate: null });
    }
    
    // Trigger validation for end date when start date changes
    if (endDate) {
      form.validateFields(['endDate']);
    }
  };

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
    if (url) {
      setEventImageUrl(url);
      // Trigger validation for image field
      form.validateFields(['eventImage']);
    }
    return false;
  };

  const handleMerchImagesUpload = async (type, { file, onSuccess, onError }) => {
    try {
      if (file.status === 'removed') return;

      const url = await uploadFile(file);
      if (url) {
        setMerchandiseData((prev) => {
          const updated = {
            ...prev,
            [type]: {
              ...prev[type],
              images: [...(prev[type]?.images || []), { url, uid: file.uid }],
            },
          };
          // Trigger merchandise validation after image upload
          setTimeout(() => form.validateFields(['merchandise']), 100);
          return updated;
        });
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
  
  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue('startDate');
    if (!current) return false;
    
    // Disable past dates
    if (current < moment().startOf('day')) {
      return true;
    }
    
    // Disable dates before start date
    if (startDate && current < moment(startDate).startOf('day')) {
      return true;
    }
    
    return false;
  };

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);

      // Manual date validation as a final check
      if (moment(values.endDate).isBefore(moment(values.startDate), 'day')) {
        message.error('End date cannot be before start date!');
        setIsSubmitting(false);
        return;
      }

      console.log('Form values:', values); // Debug log

      // Additional validation for merchandise (this should already be caught by form validation)
      await validateMerchandise();

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

      console.log('Payload:', payload); // Debug log

      const response = await axios.post('https://aiesecruhuna-production.up.railway.app/api/events', payload);
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
          return axios.post('https://aiesecruhuna-production.up.railway.app/api/merchandise', merchPayload);
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
      if (error.message && error.message.includes('merchandise')) {
        message.error(error.message);
      } else {
        message.error('Failed to create event. Please try again.');
      }
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
    
    // Trigger merchandise validation
    setTimeout(() => form.validateFields(['merchandise']), 100);
  };

  const handleDescriptionChange = (type, value) => {
    setMerchandiseData((prev) => {
      const updated = {
        ...prev,
        [type]: {
          ...prev[type],
          description: value,
          images: prev[type]?.images || []
        }
      };
      // Trigger merchandise validation after description change
      setTimeout(() => form.validateFields(['merchandise']), 100);
      return updated;
    });
  };

  const handleImageRemove = (type, file) => {
    setMerchandiseData((prev) => {
      const updated = {
        ...prev,
        [type]: {
          ...prev[type],
          images: prev[type]?.images?.filter((img) => img.uid !== file.uid) || []
        }
      };
      // Trigger merchandise validation after image removal
      setTimeout(() => form.validateFields(['merchandise']), 100);
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl px-6 py-8 mx-auto mt-6 sm:mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Create New Event</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ visibility: 'private', eventType: 'in_person' }}
        validateTrigger={["onChange", "onBlur"]}
        scrollToFirstError
      >
        <Form.Item 
          name="eventName" 
          label="Event Title" 
          rules={[
            { required: true, message: 'Please enter event title' },
            { min: 3, message: 'Event title must be at least 3 characters' },
            { max: 100, message: 'Event title must not exceed 100 characters' }
          ]}
        >
          <Input placeholder="Enter event title" />
        </Form.Item>

        <Form.Item 
          name="description" 
          label="Description" 
          rules={[
            { required: true, message: 'Please enter event description' },
            { min: 10, message: 'Description must be at least 10 characters' },
            { max: 1000, message: 'Description must not exceed 1000 characters' }
          ]}
        >
          <TextArea rows={4} placeholder="Describe the event" showCount maxLength={1000} />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item 
            name="startDate" 
            label="Start Date" 
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker 
              className="w-full" 
              disabledDate={disabledDate}
              onChange={handleStartDateChange}
            />
          </Form.Item>
          <Form.Item 
            name="endDate" 
            label="End Date" 
            rules={[
              { required: true, message: 'Please select end date' },
              { validator: validateEndDate }
            ]}
            dependencies={['startDate']}
          >
            <DatePicker 
              className="w-full" 
              disabledDate={disabledEndDate}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item 
            name="startTime" 
            label="Start Time" 
            rules={[{ required: true, message: 'Please select start time' }]}
          >
            <TimePicker 
              use12Hours 
              format="h:mm A" 
              className="w-full"
            />
          </Form.Item>
          <Form.Item 
            name="endTime" 
            label="End Time" 
            rules={[{ required: true, message: 'Please select end time' }]}
          >
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
            onChange={(e) => {
              setEventType(e.target.value);
              // Clear location field when switching types
              form.setFieldsValue({ location: '' });
            }} 
            className="flex gap-6"
          >
            <Radio value="in_person">In Person</Radio>
            <Radio value="virtual">Virtual</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item 
          name="location" 
          label={eventType === 'virtual' ? 'Meeting Link' : 'Location'} 
          rules={[
            { required: true, message: `Please enter ${eventType === 'virtual' ? 'meeting link' : 'event location'}` },
            eventType === 'virtual' ? 
              { type: 'url', message: 'Please enter a valid URL for the meeting link' } :
              { min: 3, message: 'Location must be at least 3 characters' }
          ]}
        >
          <Input placeholder={eventType === 'virtual' ? 'Enter meeting link (https://...)' : 'Enter event location'} />
        </Form.Item>

        <Form.Item 
          name="eventImage"
          label="Event Image" 
          rules={[{ validator: validateEventImage }]}
        >
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
            <p className="ant-upload-hint">Support for PNG, JPG, JPEG files only</p>
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
                form.setFieldsValue({ merchandise: undefined });
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
            <Form.Item 
              name="merchandiseTypes"
              label="Select Merchandise Items"
              rules={[
                { required: true, message: 'Please select at least one merchandise item' }
              ]}
            >
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

            <Form.Item
              name="merchandise"
              rules={[{ validator: validateMerchandise }]}
              dependencies={['merchandiseTypes']}
            >
              <div style={{ display: 'none' }} />
            </Form.Item>

            {selectedMerchTypes.map((type) => (
              <div key={type} className="mb-6 border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">{type}</h3>

                <Form.Item label={`${type} Description`}>
                  <TextArea
                    rows={3}
                    placeholder={`Enter description for ${type} (required)`}
                    value={merchandiseData[type]?.description || ''}
                    onChange={(e) => handleDescriptionChange(type, e.target.value)}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <Form.Item label={`Upload ${type} Images (Required)`}>
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
                  <div className="text-sm text-gray-500 mt-1">
                    Images uploaded: {merchandiseData[type]?.images?.length || 0}
                  </div>
                </Form.Item>
              </div>
            ))}
          </>
        )}

        <Form.Item 
          name="visibility" 
          label="Event Visibility" 
          rules={[{ required: true, message: 'Please select event visibility' }]}
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
            size="large"
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEventForm;