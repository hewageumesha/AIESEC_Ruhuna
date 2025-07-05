import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import InvoiceForm from '../components/InvoiceForm';

const EditInvoicePage = () => {
  const { id } = useParams();
  const [existingInvoice, setExistingInvoice] = useState(null);

  useEffect(() => {
    // Fetch the invoice details for editing
    axios.get(`http://localhost:8080/api/invoices/${id}`)
      .then((response) => {
        setExistingInvoice(response.data); // Set the invoice data
      })
      .catch((error) => {
        console.error('Failed to fetch invoice data', error);
        alert('Error fetching invoice data.');
      });
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto">
      {existingInvoice ? (
        <InvoiceForm existingInvoice={existingInvoice} /> // Pass existingInvoice as prop
      ) : (
        <p>Loading...</p> // Show loading message while fetching
      )}
    </div>
  );
};

export default EditInvoicePage;
