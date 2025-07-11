import React from "react";

import { useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";

const AddExpensePage = () => {
  const navigate = useNavigate();

  const refreshExpenses = () => {
    navigate("/dashboard/finance/*"); // Redirect to homepage after adding
  };

  return (
    <ExpenseForm
      refreshExpenses={refreshExpenses}
      editingExpense={null}
      setEditingExpense={() => {}} // No-op since not editing
    />
  );
};

export default AddExpensePage;
