import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../service/api"; // Adjust path if needed

const ExpenseList = ({ refreshExpenses }) => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/expenses")
      .then((response) => {
        setExpenses(response.data);
      })
      .catch(console.error);
  }, [refreshExpenses]); // include refreshExpenses to re-fetch after updates

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      try {
        await axios.delete(`/expenses/${id}`);
        refreshExpenses(); // Trigger parent refresh
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="expense-list-container p-4">
      <h1 className="text-xl font-bold mb-4">Expense List</h1>
      <table className="expense-table w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4 border">Date</th>
            <th className="p-2 border">Amount (LKR)</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Payment Method</th>
            <th className="p-2 border">Actions</th>
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
                <button className="edit-btn text-blue-600 mr-2" onClick={() =>navigate(`/expense/edit/${exp.id}`) // Correct path
}>Edit</button>
                <button className="delete-btn text-red-600" onClick={() => handleDelete(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
