import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Event A", attendees: 120 },
  { name: "Event B", attendees: 80 },
  { name: "Event C", attendees: 150 },
];

const EventChart = () => {
  return (
    <div className="mt-6">
      <h3>Event Participation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="attendees" fill="blue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventChart;