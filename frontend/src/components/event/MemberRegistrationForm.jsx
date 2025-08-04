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
    const fetchRegistration = async () => {
      if (!currentUser?.id || !eventId) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/api/member-event-registrations/user/${currentUser.id}/event/${eventId}`
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
    const payload = {
      eventId,
      memberId: currentUser?.id,
      interestStatus: values.interestStatus,
      comment: values.comment || "",
    };

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
        <Input.TextArea
          rows={3}
          placeholder="Leave a note or question..."
        />
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
