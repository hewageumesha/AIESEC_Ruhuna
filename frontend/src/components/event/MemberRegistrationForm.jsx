import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Form, Select, Input, Button, message, Card, Typography } from "antd";
import axios from "axios";

const { Option } = Select;
const { Text } = Typography;

const MemberRegistrationForm = ({ eventId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("Redux currentUser:", currentUser); // Debug log

    const fetchRegistration = async () => {
      // Extract userId safely
      const userId = currentUser?.id ?? currentUser?.userId;

      if (!userId || !eventId) return;

      try {
        const res = await axios.get(
          `http://localhost:8080/api/member-event-registrations/user/${userId}/event/${eventId}`
        );
        if (res.data && res.data.length > 0) {
          setExistingRegistration(res.data[0]); // use the first registration
        }
      } catch (err) {
        console.error("Failed to fetch registration", err);
      }
    };

    fetchRegistration();
  }, [currentUser, eventId]);

  const onFinish = async (values) => {
    const userId = currentUser?.id ?? currentUser?.userId;

    if (!userId) {
      message.error("User ID not found. Please log in again.");
      return;
    }

    const payload = {
      eventId,
      userId, // use safe userId here
      interestStatus: values.interestStatus,
      comment: values.comment || "",
    };

    console.log("sending payload:", payload);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/member-event-registrations/register",
        payload
      );
      message.success("Your response has been submitted.");
      onSuccess?.(res.data);
      setExistingRegistration(res.data); // store submitted data
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "You have already registered for this event.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Please log in to register for this event.</div>;
  }

  if (existingRegistration) {
    return (
      <Card title="You have already registered for this event" bordered>
        <p>
          <Text strong>Status:</Text> {existingRegistration.interestStatus}
        </p>
        {existingRegistration.comment && (
          <p>
            <Text strong>Comment:</Text> {existingRegistration.comment}
          </p>
        )}
        <p style={{ color: "#888", fontStyle: "italic" }}>
          You cannot submit again.
        </p>
      </Card>
    );
  }

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="interestStatus"
        label="Are you attending this event?"
        initialValue="PENDING"
        rules={[{ required: true, message: "Please select your status" }]}
      >
        <Select>
          <Option value="GOING">Going</Option>
          <Option value="PENDING">Pending</Option>
          <Option value="NOT_GOING">Not Going</Option>
        </Select>
      </Form.Item>

      <Form.Item name="comment" label="Comment (optional)">
        <Input.TextArea rows={3} placeholder="Leave a note or question..." />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Response
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MemberRegistrationForm;
