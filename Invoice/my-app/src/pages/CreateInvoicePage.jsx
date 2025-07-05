import React, { useState } from 'react';
import InvoiceForm from '../components/InvoiceForm';

const CreateInvoicePage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-6">
      <InvoiceForm onCreated={() => setRefresh(!refresh)} />
    </div>
  );
};

export default CreateInvoicePage;
