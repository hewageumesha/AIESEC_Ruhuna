import React, { useState } from 'react';
import {
  Form, Input, DatePicker, TimePicker, Button, Switch, Upload, Radio, message,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../service/supabaseClient';

const { TextArea } = Input;
const { Dragger } = Upload;

const AddEventForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventType, setEventType] = useState('in_person');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  // Upload handler
  const handleImageUpload = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from('eventimages')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      message.error('Image upload failed.');
      return '';
    }

    const { data: publicUrlData } = supabase.storage.from('eventimages').getPublicUrl(fileName);
    return publicUrlData?.publicUrl || '';
  };

  // Main form submit
  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);

      const { startDate, endDate, startTime, endTime, ...rest } = values;

      // Validation
      if (moment(endDate).isBefore(startDate, 'day')) {
        message.error('End date must be the same or after start date.');
        return;
      }

      if (
        moment(startDate).isSame(endDate, 'day') &&
        moment(endTime).isBefore(startTime)
      ) {
        message.error('End time must be after start time.');
        return;
      }

      const payload = {
        ...rest,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        eventTime: startTime.format('HH:mm:ss'),
        endTime: endTime.format('HH:mm:ss'),
        imageUrl,
        isPublic: values.isPublic,
        isVirtual: eventType === 'virtual',
        location: eventType === 'virtual' ? '' : values.location,
        virtualLink: eventType === 'virtual' ? values.location : '',
      };

      const response = await axios.post('http://localhost:8080/api/events', payload);
      const createdEvent = response.data;

      message.success('🎉 Event created successfully!');

      form.resetFields();
      setImageUrl('');

      // Redirect and pass event ID
      setTimeout(() => {
        navigate(`/event/${createdEvent.id}`); // adjust if your route is different
      }, 1000);
    } catch (error) {
      console.error(error);
      message.error('❌ Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDate = (current) => current && current < moment().startOf('day');

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isPublic: false }}
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
            <TimePicker className="w-full" format="HH:mm" />
          </Form.Item>
          <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
            <TimePicker className="w-full" format="HH:mm" />
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

        <Form.Item label="Event Image">
          <Dragger
            multiple={false}
            maxCount={1}
            beforeUpload={async (file) => {
              const url = await handleImageUpload(file);
              if (url) setImageUrl(url);
              return false;
            }}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to upload</p>
          </Dragger>
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded preview" className="mt-4 w-48 rounded shadow" />
          )}
        </Form.Item>

        <Form.Item name="isPublic" label="Public Event?" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Create Event
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEventForm;
