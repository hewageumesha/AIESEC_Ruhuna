import React, { useEffect, useState } from "react";
import axios from "../services/api";  // Assuming this contains the API methods for your backend

const ExpenseList = ({ setEditingExpense, refreshExpenses }) => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get("/expenses")
      .then((response) => {
        // Set the list of expenses to state
        setExpenses(response.data);
      })
      .catch((error) => console.error("Error fetching expenses:", error));
  }, []);

  // Handle delete function
  const handleDelete = async (expenseId) => {
    // Prompt the user for confirmation
    const isConfirmed = window.confirm("Are you sure you want to delete this expense?");
    
    if (isConfirmed) {
      try {
        await axios.delete(`/expenses/${expenseId}`);  // Use the correct API endpoint
        console.log("Expense deleted successfully!");
        alert("Expense deleted successfully!");
        refreshExpenses(); // Refresh the list of expenses
      } catch (error) {
        console.error("Error deleting expense:", error);
        //alert("Failed to delete expense.");
      }
    } else {
      console.log("Deletion canceled.");
    }
  };

  return (
    <div>
      <h2>Expenses</h2>
      {expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              {expense.date} - {expense.amount} - {expense.category} - {expense.paymentMethod}
              <button onClick={() => setEditingExpense(expense)}>Edit</button>
              <button onClick={() => handleDelete(expense.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses to display.</p>
      )}
    </div>
  );
};

export default ExpenseList;
