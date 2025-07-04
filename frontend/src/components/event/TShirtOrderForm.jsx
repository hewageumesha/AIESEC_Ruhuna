import React from 'react';
import { Form, InputNumber, Select, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const TShirtOrderForm = ({ merchandise, user, onCancel, onOrderSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const payload = {
      size: values.size,
      quantity: values.quantity,
      merchandiseId: merchandise.merchandiseId,
      userId: user?.userId || null, // Optional for guest users
    };

    try {
      const res = await axios.post('http://localhost:8080/api/tshirt-orders', payload);

      if (res.status === 201 || res.status === 200) {
        message.success('Order placed successfully!');
        onOrderSuccess(); // parent component reloads data
        form.resetFields();
      } else {
        message.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('❌ Failed to place order:', error);
      message.error('Failed to place order. Check console for details.');
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleSubmit}
      initialValues={{ size: 'M', quantity: 1 }}
    >
      <Form.Item
        name="size"
        label="T-Shirt Size"
        rules={[{ required: true, message: 'Please select a size' }]}
      >
        <Select placeholder="Select a size">
          <Option value="XS">XS</Option>
          <Option value="S">S</Option>
          <Option value="M">M</Option>
          <Option value="L">L</Option>
          <Option value="XL">XL</Option>
          <Option value="XXL">XXL</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="quantity"
        label="Quantity"
        rules={[{ required: true, message: 'Please enter quantity' }]}
      >
        <InputNumber min={1} max={10} className="w-full" />
      </Form.Item>

      <div className="flex justify-end gap-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          Place Order
        </Button>
      </div>
    </Form>
  );
};

export default TShirtOrderForm;
