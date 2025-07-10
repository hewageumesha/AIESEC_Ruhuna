import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const GuestRegistrationForm = ({ eventId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values, eventId };
      console.log("Submitting guest registration:", payload);

      const { data } = await axios.post(
        "http://localhost:8080/api/guest-registrations",
        payload
      );

      message.success("Successfully registered!");
      onSuccess?.(data); // Call success callback if provided
    } catch (err) {
      console.error("❌ Guest registration error:", err);

      const resData = err.response?.data;

      if (Array.isArray(resData)) {
        message.error(resData.join(", "));
      } else if (resData?.message) {
        message.error(resData.message);
      } else {
        message.error("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Full Name"
        name="name"
        rules={[{ required: true, message: "Please enter your full name" }]}
      >
        <Input placeholder="John Doe" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Enter a valid email" },
        ]}
      >
        <Input placeholder="you@example.com" />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phone"
        rules={[{ required: true, message: "Please enter your phone number" }]}
      >
        <Input placeholder="0771234567" />
      </Form.Item>

      <Form.Item
        label="Interest Status"
        name="interestStatus"
        initialValue="PENDING"
        rules={[{ required: true, message: "Please select your status" }]}
      >
        <Select>
          <Option value="GOING">Going</Option>
          <Option value="PENDING">Pending</Option>
          <Option value="NOT_GOING">Not Going</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Comment" name="comment">
        <Input.TextArea rows={3} placeholder="Leave a note (optional)" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Register Now
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GuestRegistrationForm;
