import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExpenseList from "../components/ExpenseList";
import InvoiceDownload from "../components/InvoiceDownload";
import axios from "../service/api";

export default function DashFinance() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [refresh, setRefresh] = useState(false);

  // Fetch total expense amount on mount and refresh
  useEffect(() => {
    axios.get("/expenses")
      .then((res) => {
        const total = res.data.reduce((sum, expense) => sum + Number(expense.amount), 0);
        setTotalExpenses(total);
      })
      .catch(console.error);
  }, [refresh]);

  // Function to trigger refresh of expense list & totals
  const refreshExpenses = () => setRefresh(prev => !prev);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Finance Dashboard</h1>

      <div className="mb-6 p-4 bg-blue-100 rounded shadow">
        <h2 className="text-xl mb-2 text-black">Total Expenses: LKR {totalExpenses.toFixed(2)}</h2>
        <Link
          to="/expense/add"
          className="inline-block bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Expense
        </Link>
      </div>

      {/* Expense List with refresh prop */}
      <ExpenseList refreshExpenses={refreshExpenses} />

      {/* Invoice Download */}
      <div className="mt-6">
        <InvoiceDownload />
      </div>
    </div>
  );
}
