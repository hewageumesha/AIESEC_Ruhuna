import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Task {
  taskId: number;
  taskName: string;
  description: string;
  deadline: string | null;
  priority: string;
  workOfStatus: string;
  assignedTo: string; // Should match backend data type (number or string)
}

const AssignedToMeTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage first
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      if (!userId) return; // Don't fetch if no user ID

      try {
        const response = await fetch(
            `http://localhost:8080/api/user/assigned/${userId}`
        );

        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();

        // Remove frontend filtering if backend already filters
        setTasks(data);
      } catch (error: any) {
        console.error("Error fetching assigned tasks:", error.message);
        Swal.fire("Error!", "Failed to load tasks.", "error");
      }
    };

    fetchAssignedTasks();
  }, [userId]); // Add userId to dependency array

  return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-black mb-4">Tasks Assigned to You</h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          {/* ... existing table structure ... */}
        </table>
      </div>
  );
};

export default AssignedToMeTaskList;
