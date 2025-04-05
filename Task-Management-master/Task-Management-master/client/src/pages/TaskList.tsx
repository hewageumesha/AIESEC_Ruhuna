import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  userId: string;
  username: string;
  numberOfTasks: number;
}

interface Task {
  taskId: number;
  taskName: string;
  deadline: string | null;
  priority: string;
  workOfStatus: string;
  description: string;
  assignedTo?: User;
}

const TaskList: React.FC = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:8080/api/users/${userId}/`);
        if (!userResponse.ok) throw new Error("Failed to fetch user details");
        const userData = await userResponse.json();
        setUserDetails(userData);

        const tasksResponse = await fetch(`http://localhost:8080/api/user/${userId}/tasks/`);
        if (!tasksResponse.ok) throw new Error("Failed to fetch user tasks");
        const userTasks = await tasksResponse.json();
        setTasks(userTasks);
      } catch (error: any) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEditTask = (taskId: number) => {
    navigate(`/user/${userId}/${taskId}`);
  };

  const handleDeleteTask = async (taskId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a94442",
      cancelButtonColor: "#4a6fa5",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteResponse = await fetch(`http://localhost:8080/api/user/${userId}/${taskId}/`, {
            method: "DELETE",
          });
          if (!deleteResponse.ok) throw new Error("Failed to delete task");
          setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        } catch (error: any) {
          console.error("Error deleting task:", error.message);
          Swal.fire("Error!", "Failed to delete the task.", "error");
        }
      }
    });
  };

  // Filter tasks based on searchQuery
  const filteredTasks = tasks.filter(
    (task) =>
      task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#f5f7fa] shadow-lg rounded-2xl">
      {userDetails && (
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Task List for <span className="text-blue-900">{userDetails.username}</span>
        </h2>
      )}
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-4 text-left">Task Title</th>
            <th className="py-2 px-4 text-left">Description</th>
            <th className="py-2 px-4 text-left">Priority</th>
            <th className="py-2 px-4 text-left">Due Date</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Assigned To</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.taskId} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-2 px-4 text-gray-800">{task.taskName}</td>
              <td className="py-2 px-4 text-gray-700">{task.description}</td>
              <td className="py-2 px-4">
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    task.priority === "HIGH"
                      ? "bg-red-200 text-red-800"
                      : task.priority === "MEDIUM"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {task.priority || "No priority"}
                </span>
              </td>
              
              <td className="py-2 px-4 text-gray-700">{task.deadline || "No due date"}</td>
              <td className="py-2 px-4">
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    task.workOfStatus === "completed"
                      ? "bg-green-300 text-green-900"
                      : "bg-yellow-300 text-yellow-900"
                  }`}
                >
                  {task.workOfStatus}
                </span>
              </td>
              <td className="py-2 px-4 text-gray-700">
                {task.assignedTo ? task.assignedTo.username : "Not Assigned"}
              </td>
              <td className="py-2 px-4 flex justify-center gap-3">
                <button
                  className="text-blue-700 hover:text-blue-900 transition"
                  onClick={() => handleEditTask(task.taskId)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="text-red-600 hover:text-red-800 transition"
                  onClick={() => handleDeleteTask(task.taskId)}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
