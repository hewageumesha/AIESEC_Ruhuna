import React, { useEffect, useState } from "react";
import axios from "../services/api";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get("/expenses")
      .then((response) => {
        // Assuming the response contains the list of expenses
        // If there are expenses, we set only the most recent one
        if (response.data.length > 0) {
          const recentExpense = response.data[0]; // Assuming the first one is the most recent
          setExpenses([recentExpense]);
        }
      })
      .catch((error) => console.error("Error fetching expenses:", error));
  }, []);

  return (
    <div>
      <h2>Most Recent Expense</h2>
      {expenses.length > 0 ? (
        <ul  key={expenses[0].id}>
           {expenses[0].date} - {expenses[0].amount} - {expenses[0].category} - {expenses[0].paymentMethod}
         
        </ul>
      ) : (
        <p>No expenses to display.</p>
      )}
    </div>
  );
};

export default ExpenseList;
