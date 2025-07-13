import React from "react";

const CustomAlert = ({ message, type, onClose }) => {
  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg ${getAlertStyles()} w-80`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          className="text-xl font-bold cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
