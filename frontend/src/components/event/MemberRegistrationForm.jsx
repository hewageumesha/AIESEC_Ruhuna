import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Form, Select, Input, Button, message, Card, Typography, Tag } from "antd";
import axios from "axios";

const { Option } = Select;
const { Text } = Typography;

const MemberRegistrationForm = ({ eventId, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchRegistration = async () => {
      const userId = currentUser?.id ?? currentUser?.userId;
      if (!userId || !eventId) return;

      try {
        const res = await axios.get(
          `http://localhost:8080/member-event-registrations/user/${userId}/event/${eventId}`
        );
        if (res.data && res.data.length > 0) {
          setExistingRegistration(res.data[0]);
          form.setFieldsValue({
            interestStatus: res.data[0].interestStatus,
            comment: res.data[0].comment || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch registration", err);
      }
    };

    fetchRegistration();
  }, [currentUser, eventId, form]);

  const onFinish = async (values) => {
    const userId = currentUser?.id ?? currentUser?.userId;
    if (!userId) {
      message.error("User ID not found. Please log in again.");
      return;
    }

    const payload = {
      eventId,
      userId,
      interestStatus: values.interestStatus,
      comment: values.comment || "",
    };

    try {
      setLoading(true);
      let res;

      if (existingRegistration) {
        // Update existing registration (PUT)
        res = await axios.put(
          `http://localhost:8080/member-event-registrations/${existingRegistration.id}`,
          payload
        );
        message.success("Your registration has been updated.");
      } else {
        // Create new registration (POST)
        res = await axios.post(
          "http://localhost:8080/member-event-registrations/register",
          payload
        );
        message.success("Your response has been submitted.");
      }

      setExistingRegistration(res.data);
      onSuccess?.(res.data);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Please log in to register for this event.</div>;
  }

  return (
    <Card
      title={
        existingRegistration ? (
          <>
            You have already registered{" "}
            <Tag color="blue" style={{ marginLeft: 8 }}>
              Editing
            </Tag>
          </>
        ) : (
          "Register for this Event"
        )
      }
      bordered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="interestStatus"
          label="Are you attending this event?"
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
            {existingRegistration ? "Update Response" : "Submit Response"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MemberRegistrationForm;
