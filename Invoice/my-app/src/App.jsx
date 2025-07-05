import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import CreateInvoicePage from './pages/CreateInvoicePage';
import InvoiceListPage from './pages/InvoiceListPage';
import EditInvoicePage from './pages/EditInvoicePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50">
        <nav className="p-4 bg-blue-600 text-white flex justify-center gap-4 shadow">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'text-yellow-400' : 'hover:underline'}
          >
            Create Invoice
          </NavLink>
          <NavLink 
            to="/invoices" 
            className={({ isActive }) => isActive ? 'text-yellow-400' : 'hover:underline'}
          >
            Invoice List
          </NavLink>
        </nav>

        <main className="p-8">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Invoice Management</h1>
          <Routes>
            <Route path="/" element={<CreateInvoicePage />} />
            <Route path="/invoices" element={<InvoiceListPage />} />
            <Route path="/invoices/:id/edit" element={<EditInvoicePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
