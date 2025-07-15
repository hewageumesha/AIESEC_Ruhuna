import React, { useState } from "react";
import axios from "axios";

const BirthdayForm = () => {
  const [formData, setFormData] = useState({ name: "", date: "", photo: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://aiesecinruhuna-production.up.railway.app/api/birthdays", formData);
      alert("Birthday added successfully!");
      setFormData({ name: "", date: "", photo: "" });
    } catch (err) {
      alert("Failed to add birthday.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {["name", "date",  "photo"].map((field) => (
        <div className="mb-4" key={field}>
          <label htmlFor={field} className="block text-gray-700 font-medium mb-2 capitalize">
            {field === "photo" ? "Photo URL" : field === "date" ? "Date of Birth" : "Name"}
          </label>
          <input
            type={field === "date" ? "date" : "text"}
            id={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      ))}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
        Add Birthday
      </button>
    </form>
  );
};

export default BirthdayForm;
