import React from "react";
import jsPDF from "jspdf";

const InvoiceDownload = ({ expenses }) => {
    const generateInvoice = () => {
        const doc = new jsPDF();
        doc.text("Expense Tracker Invoice", 20, 20);
        let y = 30;

        expenses.forEach((exp, index) => {
            doc.text(`Expense ${index + 1}: ${exp.id}`, 20, y);
            doc.text(`Date: ${exp.date}`, 20, y + 10);
            doc.text(`Amount: $${exp.amount}`, 20, y + 20);
            doc.text(`Category: ${exp.category}`, 20, y + 30);
            doc.text(`Payment Method: ${exp.paymentMethod}`, 20, y + 40);
            doc.text(`Description: ${exp.description}`, 20, y + 50);
            y += 60;
        });

        doc.save("invoice.pdf");
    };

    return (
        <div className="text-center mt-4">
            <button onClick={generateInvoice} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Download Invoice
            </button>
        </div>
    );
};

export default InvoiceDownload;
