import React, { useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const GuestRegistrationForm = ({ eventId, onClose }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('/api/guest-event-registration', {
        eventId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        interestStatus: values.interestStatus,
        comment: values.comment,
      });
      message.success('Guest registration successful!');
      onClose();
    } catch {
      message.error('Failed to register guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish} initialValues={{ interestStatus: 'GOING' }}>
      <Form.Item
        name="name"
        label="Full Name"
        rules={[{ required: true, message: 'Please enter your name!' }]}
      >
        <Input placeholder="Your full name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input placeholder="example@example.com" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: 'Please enter your phone number!' }]}
      >
        <Input placeholder="e.g., +1234567890" />
      </Form.Item>

      <Form.Item
        name="interestStatus"
        label="Interest Status"
        rules={[{ required: true, message: 'Please select your interest status!' }]}
      >
        <Select placeholder="Select status">
          <Option value="GOING">Going</Option>
          <Option value="PENDING">Pending</Option>
          <Option value="NOT_GOING">Not Going</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="comment"
        label="Comments or Questions"
        rules={[{ max: 250, message: 'Maximum 250 characters allowed' }]}
      >
        <Input.TextArea rows={3} placeholder="Optional" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Register as Guest
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GuestRegistrationForm;
