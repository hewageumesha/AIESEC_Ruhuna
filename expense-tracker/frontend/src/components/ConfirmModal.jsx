import React from "react";

const ConfirmModal = ({ isVisible, message, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-xl mb-4 text-center">{message}</h3>
        <div className="flex justify-between">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
