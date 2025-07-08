import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../service/api";
import ExpenseForm from "../components/ExpenseForm";

const EditExpensePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    axios.get(`/expenses/${id}`).then((res) => setEditingExpense(res.data));
  }, [id]);

  const refreshExpenses = () => {
    navigate("/"); // Navigate back after update
  };

  if (!editingExpense) return <p>Loading...</p>; // Optional loading state

  return (
    <ExpenseForm
      editingExpense={editingExpense}
      setEditingExpense={setEditingExpense}
      refreshExpenses={refreshExpenses}
    />
  );
};

export default EditExpensePage;
