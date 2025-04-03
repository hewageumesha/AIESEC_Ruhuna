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
}

const TaskList: React.FC = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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

  const handlePriorityChange = async (taskId: number, newPriority: string) => {
    try {
      const updateResponse = await fetch(`http://localhost:8080/api/user/${userId}/${taskId}/priority`, {
        method: "PUT",
        body: JSON.stringify({ priority: newPriority }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!updateResponse.ok) throw new Error("Failed to update priority");
      const updatedTask = await updateResponse.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.taskId === taskId ? { ...task, priority: updatedTask.priority } : task
        )
      );
      Swal.fire("Updated!", "Task priority has been updated.", "success");
    } catch (error: any) {
      console.error("Error updating priority:", error.message);
      Swal.fire("Error!", "Failed to update priority.", "error");
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const updateResponse = await fetch(`http://localhost:8080/api/user/${userId}/${taskId}/status`, {
        method: "PUT",
        body: JSON.stringify({ workOfStatus: newStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!updateResponse.ok) throw new Error("Failed to update status");
      const updatedTask = await updateResponse.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.taskId === taskId ? { ...task, workOfStatus: updatedTask.workOfStatus } : task
        )
      );
      Swal.fire("Updated!", "Task status has been updated.", "success");
    } catch (error: any) {
      console.error("Error updating status:", error.message);
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  };

  const renderPriorityOptions = (task: Task) => {
    const priorityOptions = ["High", "Medium", "Low"];
    return (
      <select
        value={task.priority}
        onChange={(e) => handlePriorityChange(task.taskId, e.target.value)}
        className="bg-gray-300 text-black px-2 py-1 rounded"
      >
        {priorityOptions.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>
    );
  };

  const renderStatusOptions = (task: Task) => {
    const statusOptions = ["In Progress", "Complete"];
    return (
      <select
        value={task.workOfStatus}
        onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
        className="bg-gray-300 text-black px-2 py-1 rounded"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {userDetails && <h2 className="text-2xl font-bold text-black mb-4">Task List for {userDetails.username}</h2>}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-2 px-4">Task Title</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Priority</th>
            <th className="py-2 px-4">Due Date</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskId} className="border-b hover:bg-gray-200">
              <td className="py-2 px-4 text-black">{task.taskName}</td>
              <td className="py-2 px-4 text-black">{task.description}</td>
              <td className="py-2 px-4">{renderPriorityOptions(task)}</td>
              <td className="py-2 px-4 text-black">{task.deadline ? task.deadline : "No due date"}</td>
              <td className="py-2 px-4">{renderStatusOptions(task)}</td>
              <td className="py-2 px-4 flex gap-2 justify-center">
                <button className="text-blue-500 hover:underline" onClick={() => handleEditTask(task.taskId)}>✏️</button>
                <button className="text-red-500 hover:underline" onClick={() => handleDeleteTask(task.taskId)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
