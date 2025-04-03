import React, { useState } from "react";
import axios from "axios";

const TShirtOrders = () => {
  const [order, setOrder] = useState({
    size: "",
    quantity: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/tshirt-orders", order);
      alert("T-shirt order placed successfully!");
    } catch (error) {
      console.error("Error placing order", error);
      alert("There was an error placing the order.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">T-Shirt Orders</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">T-Shirt Size</label>
          <select
            name="size"
            value={order.size}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">Extra Large</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={order.quantity}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default TShirtOrders;