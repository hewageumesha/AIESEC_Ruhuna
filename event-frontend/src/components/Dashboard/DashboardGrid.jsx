import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardGrid = () => {
  const navigate = useNavigate();

  const items = [
    { name: "Add Event", route: "/add-event" },
    { name: "Manage Events", route: "/manage-events" },
    { name: "Gallery", route: "/gallery" },
    { name: "T-Shirt Orders", route: "/tshirt-orders" },
    
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      {items.map((item) => (
        <div key={item.name} className="p-4 bg-gray-200 rounded-lg cursor-pointer"
             onClick={() => navigate(item.route)}>
          <h3>{item.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default DashboardGrid;