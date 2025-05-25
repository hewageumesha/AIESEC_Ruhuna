import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const MemberRegistrationForm = ({ userId, eventId, onClose = () => {} }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("🔍 userId:", userId);
    console.log("🔍 eventId:", eventId);
  }, [userId, eventId]);

  const onFinish = async (values) => {
    if (!userId || !eventId) {
      message.error("❌ Missing user ID or event ID. Please try again.");
      console.error("Registration failed: userId or eventId is missing.", { userId, eventId });
      return;
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();

      const payload = {
        userId,
        eventId,
        interestStatus: values.interestStatus,
        comment: values.comment || '',
        registeredAt: now,
      };

      console.log("📤 Sending payload:", payload);

      await axios.post('http://localhost:8080/api/member-event-registrations/register', payload);

      message.success('✅ Member registration successful!');
      onClose();
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      message.error(
        error.response?.data?.message || '❌ Failed to register member. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish} initialValues={{ interestStatus: 'GOING' }}>
      <Form.Item
        name="interestStatus"
        label="Interest Status"
        rules={[{ required: true, message: 'Please select your interest status!' }]}
      >
        <Select placeholder="Select your status">
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
          Register as Member
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MemberRegistrationForm;
