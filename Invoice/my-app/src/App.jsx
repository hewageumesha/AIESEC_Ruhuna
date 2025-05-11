import React from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';

function App() {
    return (
        <div className="p-8 bg-blue-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Invoice Management</h1>
            <InvoiceForm onCreated={() => window.location.reload()} />
            <div className="mt-8">
                <InvoiceList />
            </div>
        </div>
    );
}

export default App;
