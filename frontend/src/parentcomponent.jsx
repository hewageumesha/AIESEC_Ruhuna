import React, { useState } from "react";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";


const ParentComponent = () => {
  // State to store the expense being edited
  const [editingExpense, setEditingExpense] = useState(null);

  // Function to refresh the expenses list
  const refreshExpenses = () => {
    console.log("Expenses refreshed!");
    // Implement logic to refresh the list of expenses (e.g., re-fetch from an API)
  };

  return (
    <div>
      {/* Render ExpenseForm only if editingExpense is null or an existing expense */}
      <ExpenseForm 
        editingExpense={editingExpense} 
        setEditingExpense={setEditingExpense} 
        refreshExpenses={refreshExpenses} 
      />

      {/* Render the expense list */}
      <ExpenseList 
        setEditingExpense={setEditingExpense} 
        refreshExpenses={refreshExpenses} 
      />
    </div>
  );
};

export default ParentComponent;
