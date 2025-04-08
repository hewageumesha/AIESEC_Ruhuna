import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Task {
  taskId: number;
  taskName: string;
  description: string;
  deadline: string | null;
  priority: string;
  workOfStatus: string;
  assignedTo: string; // assuming this field exists
}

const AssignedToMeTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve logged-in user's ID (assume it's stored in localStorage)
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    const fetchAssignedTasks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/user/tasks/assigned`);
        const allTasks = await response.json();

        // Filter only tasks assigned to the logged-in user
        const filteredTasks = allTasks.filter((task: Task) => task.assignedTo === storedUserId);
        setTasks(filteredTasks);
      } catch (error: any) {
        console.error("Error fetching assigned tasks:", error.message);
      }
    };

    if (storedUserId) fetchAssignedTasks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-black mb-4">Tasks Assigned to You</h2>
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
                <span className={
                  task.priority === "High" ? "bg-red-400 text-white px-2 py-1 rounded-full" :
                  task.priority === "Medium" ? "bg-yellow-400 text-white px-2 py-1 rounded-full" :
                  "bg-green-400 text-white px-2 py-1 rounded-full"
                }>
                  {task.priority}
                </span>
              </td>
              <td className="py-2 px-4 text-black">{task.deadline ?? "No deadline"}</td>
              <td className={`py-2 px-4 ${task.workOfStatus === "Complete" ? "bg-green-400 text-white" : "bg-yellow-400 text-white"} px-2 py-1 rounded-full`}>
                {task.workOfStatus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedToMeTaskList;
