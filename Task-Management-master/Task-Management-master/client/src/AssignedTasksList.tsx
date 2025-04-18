import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Match your backend's TaskDto structure
interface Task {
  taskId: number;
  taskName: string;
  description: string;
  deadLine: string | null;
  priority: string;
  workOfStatus: string;
  assignedTo: number | null; // Should match backend (number or null)
}

const AssignedToMeTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Get userId from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId && !isNaN(Number(storedUserId))) {
      setUserId(Number(storedUserId));
    } else {
      setUserId(null);
      setLoading(false);
    }
  }, []);

  // Fetch assigned tasks when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchAssignedTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
            `http://localhost:8080/api/user/assigned/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error("Error fetching assigned tasks:", error.message);
        Swal.fire("Error!", "Failed to load tasks.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTasks();
  }, [userId]);

  return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-black mb-4">Tasks Assigned to You</h2>
        {loading ? (
            <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks assigned to you.</p>
        ) : (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
              <tr className="bg-purple-600 text-white">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Priority</th>
                <th className="py-2 px-4">Deadline</th>
                <th className="py-2 px-4">Status</th>
              </tr>
              </thead>
              <tbody>
              {tasks.map((task) => (
                  <tr key={task.taskId} className="border-b hover:bg-gray-200">
                    <td className="py-2 px-4 text-black">{task.taskName}</td>
                    <td className="py-2 px-4 text-black">{task.description}</td>
                    <td className="py-2 px-4">
                  <span
                      className={
                        task.priority === "HIGH"
                            ? "bg-red-400 text-white px-2 py-1 rounded-full"
                            : task.priority === "MEDIUM"
                                ? "bg-yellow-400 text-white px-2 py-1 rounded-full"
                                : "bg-green-400 text-white px-2 py-1 rounded-full"
                      }
                  >
                    {task.priority}
                  </span>
                    </td>
                    <td className="py-2 px-4 text-black">
                      {task.deadLine ? new Date(task.deadLine).toLocaleDateString() : "No deadline"}
                    </td>
                    <td
                        className={`py-2 px-4 ${
                            task.workOfStatus === "completed"
                                ? "bg-green-400 text-white"
                                : "bg-yellow-400 text-white"
                        } px-2 py-1 rounded-full`}
                    >
                      {task.workOfStatus}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
};

export default AssignedToMeTaskList;
