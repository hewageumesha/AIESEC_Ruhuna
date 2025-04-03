import React, { useState } from "react";
import ExpenseList from "./components/ExpenseList";
  

const ParentComponent = () => {
  // State to store the expense being edited
  const [editingExpense, setEditingExpense] = useState(null);

  // Function to refresh the expenses list
  const refreshExpenses = () => {
    // Logic to refresh the list of expenses (e.g., re-fetching the data)
    console.log("Expenses refreshed!");
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      {/* Pass the setEditingExpense and refreshExpenses functions as props */}
      <ExpenseList
        setEditingExpense={setEditingExpense}  // Function to update the editing expense state
        refreshExpenses={refreshExpenses}      // Function to refresh expenses
      />
      {/* Optionally, display the editing expense */}
      {editingExpense && (
        <div>
          <h3>Editing Expense:</h3>
          <p>{editingExpense.date} - {editingExpense.amount} - {editingExpense.category}</p>
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
