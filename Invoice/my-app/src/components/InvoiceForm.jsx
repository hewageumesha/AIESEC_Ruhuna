import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, NavLink } from 'react-router-dom'; // Import NavLink

const InputField = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
      {...props}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

const InvoiceForm = ({ existingInvoice = null, onCreated }) => {
  const navigate = useNavigate(); // navigate hook for redirection
  const { id } = useParams(); // To fetch specific invoice if editing

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingInvoice) {
      console.log('Existing Invoice:', existingInvoice); // Log to inspect the invoice data
      setFormData(existingInvoice);
    }
  }, [existingInvoice]);

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = 'Customer name is required.';
    if (!formData.customerEmail) newErrors.customerEmail = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) newErrors.customerEmail = 'Invalid email.';
    if (!formData.description) newErrors.description = 'Description is required.';
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Enter a valid amount.';
    if (formData.tax && Number(formData.tax) < 0) newErrors.tax = 'Tax must be positive.';
    if (formData.discount && Number(formData.discount) < 0) newErrors.discount = 'Discount must be positive.';
    if (!formData.issueDate) newErrors.issueDate = 'Issue date is required.';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required.';
    if (formData.issueDate && formData.dueDate && formData.dueDate < formData.issueDate)
      newErrors.dueDate = 'Due date must be after issue date.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (existingInvoice || id) {
        // Update existing invoice
        await axios.put(`http://localhost:8080/api/invoices/${id || existingInvoice.id}`, formData);
        alert('Invoice updated!');
      } else {
        // Create a new invoice
        await axios.post('http://localhost:8080/api/invoices', formData);
        alert('Invoice created!');
      }
      navigate('/invoices'); // Redirect to invoice list page after success
    } catch (err) {
      alert('Failed to process the invoice.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-600">
        {existingInvoice || id ? 'Edit Invoice' : 'Create Invoice'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} error={errors.customerName} />
        <InputField label="Customer Email" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} error={errors.customerEmail} />
        <InputField label="Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} />
        <InputField label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} error={errors.amount} />
        <InputField label="Tax (%)" name="tax" type="number" value={formData.tax} onChange={handleChange} error={errors.tax} />
        <InputField label="Discount (%)" name="discount" type="number" value={formData.discount} onChange={handleChange} error={errors.discount} />
        <InputField label="Currency" name="currency" value={formData.currency} onChange={handleChange} />
        <InputField label="Issue Date" name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} error={errors.issueDate} />
        <InputField label="Due Date" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} error={errors.dueDate} />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition duration-300"
      >
        {existingInvoice || id ? 'Update Invoice' : 'Create Invoice'}
      </button>

      {/* Add a navigation link to go back to the invoices list */}
      <div className="mt-4 text-center">
        <NavLink to="/invoices" className="text-blue-600 hover:text-blue-800">Back to Invoices</NavLink>
      </div>
    </form>
  );
};

export default InvoiceForm;
