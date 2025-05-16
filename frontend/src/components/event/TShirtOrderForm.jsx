import React, { useState } from "react";
import { Button, Select, InputNumber, Form, message } from "antd";
import axios from "axios";

const { Option } = Select;

const TshirtSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
]; // Should match your backend enum values

const TShirtOrderForm = ({
  merchandise,
  eventId,
  user,
  guestUser,
  onOrderSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  // Guest user info state (if no user logged in)
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // You can adjust validation and form layout as needed
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    if (!merchandise) {
      message.error("Merchandise data not loaded.");
      return;
    }

    if (!user && (!guestName || !guestEmail)) {
      message.error("Please enter your name and email as a guest.");
      return;
    }

    setLoading(true);

    const orderPayload = {
      merchandiseId: merchandise.merchandiseId,
      quantity: values.quantity,
      size: values.size,
      userId: user ? user.id : null,
      guestUser: user
        ? null
        : {
            name: guestName,
            email: guestEmail,
          },
    };

    try {
      await axios.post("http://localhost:8080/api/tshirt-orders", orderPayload);
      message.success("T-Shirt order placed!");
      form.resetFields();
      setGuestName("");
      setGuestEmail("");
      if (onOrderSuccess) onOrderSuccess();
    } catch (error) {
      console.error("Failed to place order:", error);
      message.error(
        error.response?.data || error.message || "Failed to place T-shirt order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="max-w-md"
    >
      {!user && (
        <>
          <Form.Item
            label="Name"
            name="guestName"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Your name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="guestEmail"
            rules={[
              { required: true, message: "Please enter your email" },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Your email"
            />
          </Form.Item>
        </>
      )}

      <Form.Item
        label="Size"
        name="size"
        rules={[{ required: true, message: "Please select a T-shirt size" }]}
      >
        <Select placeholder="Select size">
          {TshirtSizes.map((size) => (
            <Option key={size} value={size}>
              {size}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[
          { required: true, message: "Please enter quantity" },
          {
            type: "number",
            min: 1,
            message: "Quantity must be at least 1",
          },
        ]}
        initialValue={1}
      >
        <InputNumber min={1} className="w-full" />
      </Form.Item>

      <Form.Item>
        <div className="flex space-x-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Place Order
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default TShirtOrderForm;
