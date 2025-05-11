import React, { useState } from 'react';
import axios from 'axios';

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      {...props}
    />
  </div>
);

const InvoiceForm = ({ onCreated }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    description: '',
    amount: '',
    tax: '',
    discount: '',
    currency: 'LKR',
    issueDate: '',
    dueDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8080/api/invoices', formData);
    alert('Invoice created!');
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-600">Create Invoice</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Customer Name" name="customerName" onChange={handleChange} />
        <InputField label="Customer Email" name="customerEmail" type="email" onChange={handleChange} />
        <InputField label="Description" name="description" onChange={handleChange} />
        <InputField label="Amount" name="amount" type="number" onChange={handleChange} />
        <InputField label="Tax (%)" name="tax" type="number" onChange={handleChange} />
        <InputField label="Discount (%)" name="discount" type="number" onChange={handleChange} />
        <InputField label="Currency" name="currency" onChange={handleChange} />
        <InputField label="Issue Date" name="issueDate" type="date" onChange={handleChange} />
        <InputField label="Due Date" name="dueDate" type="date" onChange={handleChange} />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition duration-300"
      >
        Create Invoice
      </button>
    </form>
  );
};

export default InvoiceForm;
