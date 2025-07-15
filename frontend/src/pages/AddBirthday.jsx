import React, { useState } from "react";
import axios from "axios";

const AddBirthday = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    photo: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      // Send POST request
      await axios.post("https://aiesecinruhuna-production.up.railway.app/api/birthdays", formData);

      await axios.post("https://aiesecinruhuna-production.up.railway.app//api/birthdays", formData);

      setSuccessMsg("🎉 Birthday added successfully!");
      setFormData({ name: "", date: "", role: "", email: "", photo: "" });

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to add birthday.");
      console.error(err);
    }
  };

  return (
   <div className="min-h-screen bg-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-start py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md text-black dark:text-white"
      >
        <h2 className="text-center text-lg font-semibold mb-4">
          Add New Birthday
        </h2>

        {successMsg && (
          <div className="mb-4 bg-green-100 dark:bg-green-800 border border-green-400 dark:border-green-500 text-green-700 dark:text-green-200 px-4 py-2 rounded">
            {successMsg}
          </div>
        )}

        {["name", "date", "photo"].map((field) => (
          <div className="mb-4" key={field}>
            <label
              htmlFor={field}
              className="block font-medium mb-2 text-white dark:text-gray-200"
            >
              {field === "photo"
                ? "Photo URL"
                : field === "date"
                ? "Date of Birth"
                : "Name"}
            </label>
            <input
              type={field === "date" ? "date" : "text"}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gray-600 dark:bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-700 transition duration-200"
        >
          Add Birthday
        </button>
      </form>
    </div>
  );
};

export default AddBirthday;
