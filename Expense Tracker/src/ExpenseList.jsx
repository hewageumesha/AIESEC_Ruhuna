import React from "react";

const ExpenseList = ({ expenses }) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💵 Expenses</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center">No expenses added yet.</p>
        ) : (
          expenses.map((expense, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md mb-4">
              <p><strong>ID:</strong> {expense.id}</p>
              <p><strong>Date:</strong> {expense.date}</p>
              <p><strong>Amount:</strong> ${expense.amount}</p>
              <p><strong>Category:</strong> {expense.category}</p>
              <p><strong>Description:</strong> {expense.description}</p>
              <p><strong>Payment Method:</strong> {expense.paymentMethod}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
