import React, { useState } from 'react';
import {
  Form, Input, DatePicker, TimePicker, Button, Upload, Radio, message,
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
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [tshirtAvailable, setTshirtAvailable] = useState(false);
  const [merchDesc, setMerchDesc] = useState('');
  const [merchImages, setMerchImages] = useState([]);

  const navigate = useNavigate();

  const uploadFile = async (file, folder = 'eventimages') => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from(folder)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        message.error(`Upload failed: ${error.message}`);
        return '';
      }

      const { data } = supabase.storage.from(folder).getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      message.error('Unexpected upload error');
      console.error(err);
      return '';
    }
  };

  const handleEventImageUpload = async (file) => {
    const url = await uploadFile(file, 'eventimages');
    if (url) setEventImageUrl(url);
    return false;
  };

  const handleMerchImagesUpload = async ({ file }) => {
    if (file.status === 'removed') {
      setMerchImages((prev) => prev.filter((img) => img.uid !== file.uid));
      return;
    }
    if (file.originFileObj) {
      const url = await uploadFile(file.originFileObj, 'eventimages');
      if (url) {
        setMerchImages((prev) => [...prev, { url, uid: file.uid }]);
      }
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

      if (tshirtAvailable) {
        if (!merchDesc.trim()) {
          message.error('Please enter merchandise description.');
          setIsSubmitting(false);
          return;
        }
        if (merchImages.length < 1) {
          message.error('Please upload at least one merchandise image.');
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
        hasTshirtOrder: tshirtAvailable,
      };

      const response = await axios.post('http://localhost:8080/api/events', payload);
      const eventId = response.data.eventId;

      if (tshirtAvailable) {
        const merchPayload = {
          eventId,
          description: merchDesc.trim(),
          images: merchImages.map((img) => img.url),
          available: true,
        };
        await axios.post('http://localhost:8080/api/merchandise', merchPayload);
      }

      message.success('✅ Event published successfully!');
      form.resetFields();
      setEventImageUrl('');
      setTshirtAvailable(false);
      setMerchDesc('');
      setMerchImages([]);

      // ✅ Redirect based on public/private
navigate(values.visibility === 'public' ? `/public-event` : `/event/${eventId}`);


    } catch (error) {
      console.error(error);
      message.error('❌ Failed to publish event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl px-6 py-8 mx-auto mt-6 sm:mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Create New Event</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          visibility: 'private',
          eventType: 'in_person',
        }}
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

        <Form.Item label="T-shirt Order Available?">
          <Radio.Group
            onChange={(e) => setTshirtAvailable(e.target.value === 'yes')}
            value={tshirtAvailable ? 'yes' : 'no'}
            className="flex gap-8"
          >
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>

        {tshirtAvailable && (
          <>
            <Form.Item label="Merchandise Description">
              <TextArea
                rows={3}
                value={merchDesc}
                onChange={(e) => setMerchDesc(e.target.value)}
                placeholder="Enter merchandise details"
              />
            </Form.Item>

            <Form.Item label="Upload Merchandise Images (Min: 3)">
              <Upload
                listType="picture"
                onChange={handleMerchImagesUpload}
                multiple
                accept="image/*"
              >
                <Button icon={<InboxOutlined />}>Upload Images</Button>
              </Upload>
            </Form.Item>
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
            className="w-full bg-blue-600"
          >
            Create Event
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEventForm;
