import React, { useState } from 'react';
import { Form, Select, Button, InputNumber, Input, message } from 'antd';

const { Option } = Select;

const DynamicOrderForm = ({ merchandise, onCancel, onOrderSuccess }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Add your order submission logic here
      console.log('Order values:', values);
      message.success('Order placed successfully!');
      onOrderSuccess();
    } catch (error) {
      console.error('Order submission error:', error);
      message.error('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    const type = merchandise.type.toLowerCase();
    
    switch(type) {
      case 't-shirt':
      case 'tshirt':
        return (
          <>
            <Form.Item
              name="size"
              label="Size"
              rules={[{ required: true, message: 'Please select a size' }]}
            >
              <Select placeholder="Select size">
                <Option value="XS">XS</Option>
                <Option value="S">Small</Option>
                <Option value="M">Medium</Option>
                <Option value="L">Large</Option>
                <Option value="XL">XL</Option>
                <Option value="XXL">XXL</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: 'Please enter quantity' }]}
            >
              <InputNumber min={1} max={10} placeholder="Enter quantity" className="w-full" />
            </Form.Item>
          </>
        );
      
      case 'hoodie':
        return (
          <>
            <Form.Item
              name="size"
              label="Size"
              rules={[{ required: true, message: 'Please select a size' }]}
            >
              <Select placeholder="Select size">
                <Option value="S">Small</Option>
                <Option value="M">Medium</Option>
                <Option value="L">Large</Option>
                <Option value="XL">XL</Option>
                <Option value="XXL">XXL</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: 'Please enter quantity' }]}
            >
              <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full" />
            </Form.Item>
          </>
        );
      
      case 'cap':
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
      
      case 'bag':
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={3} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
      
      case 'mug':
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
      
      case 'wristband':
      case 'sticker':
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={10} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
      
      default:
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg">
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Order {merchandise.type}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{merchandise.description}</p>
        </div>
        
        {renderFormFields()}
        
        <Form.Item name="notes" label={<span className="text-gray-900 dark:text-gray-100">Special Notes (Optional)</span>}>
          <Input.TextArea 
            rows={3} 
            placeholder="Any special requirements or notes..." 
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </Form.Item>
        
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} className="dark:border-gray-600 dark:text-gray-300">
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isSubmitting} 
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Place Order
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DynamicOrderForm;