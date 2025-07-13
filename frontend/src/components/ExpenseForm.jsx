import React, { useState, useEffect } from "react";
import { createExpense, updateExpense, deleteExpense } from "../service/api";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import ConfirmModal from "../components/ConfirmModal";
import CustomAlert from "../components/CustomAlert";

const ExpenseForm = ({ refreshExpenses, editingExpense, setEditingExpense }) => {
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    paymentMethod: "",
    role: "",
    userId: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setExpense(editingExpense);
    } else {
      setExpense({
        amount: "",
        category: "",
        date: "",
        description: "",
        paymentMethod: "",
        role: "",
        userId: "",
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    if (isNaN(expense.amount) || Number(expense.amount) <= 0) {
      setAlertMessage("Please enter a valid amount greater than 0.");
      setAlertType("error");
      return;
    }
    if (!expense.date || expense.date > today) {
      setAlertMessage("Please select a valid date (not in the future).");
      setAlertType("error");
      return;
    }
    if (!expense.userId.trim()) {
      setAlertMessage("User ID cannot be empty.");
      setAlertType("error");
      return;
    }

    const roleIdPattern = /^(LCP|LCVP)\d+$/i;
    if (!roleIdPattern.test(expense.userId)) {
      setAlertMessage("Invalid Role ID! It should start with 'LCP' or 'LCVP' followed by numbers (e.g., LCP123).");
      setAlertType("error");
      return;
    }

    expense.userId = expense.userId.toUpperCase();

    if (expense.description.trim().length < 3) {
      setAlertMessage("Description must be at least 3 characters long.");
      setAlertType("error");
      return;
    }

    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expense);
        setAlertMessage("Expense updated successfully!");
        setAlertType("success");
        setEditingExpense(null);
      } else {
        await createExpense(expense);
        setAlertMessage("Expense added successfully!");
        setAlertType("success");
      }
      refreshExpenses();
    } catch (error) {
      setAlertMessage("Error saving expense!");
      setAlertType("error");
      console.error("Error saving expense:", error);
    }
  };

  const handleDelete = () => {
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteExpense(editingExpense.id);
      setAlertMessage("Expense deleted successfully!");
      setAlertType("success");
      setEditingExpense(null);
      refreshExpenses();
      setIsModalVisible(false);
    } catch (error) {
      setAlertMessage("Error deleting expense.");
      setAlertType("error");
      console.error("Error deleting expense:", error);
    }
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white text-black dark:bg-gray-800 dark:text-white shadow-lg rounded-lg w-full max-w-md mx-auto"
      >
        <h2 className="text-xl font-bold text-center mb-4">
          {editingExpense ? "Edit Expense" : "Add Expense"}
        </h2>

        <input
          type="number"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          placeholder="Amount (LKR)"
          required
          className="w-full p-2 border rounded mb-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <select
          name="category"
          value={expense.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          name="description"
          value={expense.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded mb-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        <select
          name="role"
          value={expense.role}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Select Role</option>
          <option value="lcp">LCP</option>
          <option value="lcvp">LCVP</option>
        </select>
        <input
          type="text"
          name="userId"
          value={expense.userId}
          onChange={handleChange}
          placeholder="Role ID"
          required
          className="w-full p-2 border rounded mb-2 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <select
          name="paymentMethod"
          value={expense.paymentMethod}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Select Payment Method</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="bankTransfer">Bank Transfer</option>
        </select>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 w-full"
        >
          <FaEdit />
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {editingExpense && (
        <div className="fixed top-4 right-4 flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            onClick={handleDelete}
          >
            <FaTrash /> Delete
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
            onClick={() => setEditingExpense(null)}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      )}

      <ConfirmModal
        isVisible={isModalVisible}
        message="Are you sure you want to delete this expense?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage("")}
        />
      )}
    </>
  );
};

export default ExpenseForm;
