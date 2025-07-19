import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api"; // Use your configured axios instance

const ExpenseList = ({ refreshExpenses }) => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/expenses")
      .then((response) => {
        setExpenses(response.data);
      })
      .catch(console.error);
  }, [refreshExpenses]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      try {
        await api.delete(`/expenses/${id}`);
        refreshExpenses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDownloadInvoice = async (id) => {
  try {
    const response = await api.get(`/invoice/download/${id}`, {
      responseType: "blob"
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Axios error message:", error.message);
    }
  }
};


  return (
    <div className="expense-list-container p-4">
      <h1 className="text-xl font-bold mb-4">Expense List</h1>
      <table className="expense-table w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4 border text-black">Date</th>
            <th className="p-2 border text-black">Amount (LKR)</th>
            <th className="p-2 border text-black">Description</th>
            <th className="p-2 border text-black">Category</th>
            <th className="p-2 border text-black">Payment Method</th>
            <th className="p-2 border text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id} className="text-center">
              <td className="p-4 border">{exp.date}</td>
              <td className="p-2 border">{exp.amount}</td>
              <td className="p-2 border">{exp.description}</td>
              <td className="p-2 border capitalize">{exp.category}</td>
              <td className="p-2 border capitalize">{exp.paymentMethod}</td>
              <td className="p-2 border">
                <button
                  className="edit-btn text-blue-600 mr-2"
                  onClick={() => navigate(`/expense/edit/${exp.id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn text-red-600 mr-2"
                  onClick={() => handleDelete(exp.id)}
                >
                  Delete
                </button>
                <button
                  className="download-btn text-green-600"
                  onClick={() => handleDownloadInvoice(exp.id)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
