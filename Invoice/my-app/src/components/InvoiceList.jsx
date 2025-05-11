import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);

    const fetchInvoices = async () => {
        const res = await axios.get('http://localhost:8080/api/invoices');
        setInvoices(res.data);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <div className="space-y-4">
            {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 bg-white rounded-xl shadow flex justify-between">
                    <div>
                        <p><strong>{invoice.invoiceNumber}</strong> - {invoice.customerName}</p>
                        <p>{invoice.status} | {invoice.amount} {invoice.currency}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.open(`http://localhost:8080/api/invoices/${invoice.id}/pdf`, '_blank')}>Download PDF</Button>
                        <Button variant="destructive" onClick={async () => {
                            await axios.delete(`http://localhost:8080/api/invoices/${invoice.id}`);
                            fetchInvoices();
                        }}>Delete</Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InvoiceList;
