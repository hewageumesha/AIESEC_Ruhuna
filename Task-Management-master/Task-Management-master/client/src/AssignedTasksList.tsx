import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  userId: string;
  username: string;
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

const AssignedTo: React.FC = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

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
  }, [userId, refreshKey]);

  const handleEditTask = (taskId: number) => navigate(`/user/${userId}/${taskId}`);

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
          const deleteResponse = await fetch(`http://localhost:8080/api/user/${userId}/${taskId}/`, { method: "DELETE" });
          if (!deleteResponse.ok) throw new Error("Failed to delete task");
          setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        } catch (error: any) {
          console.error("Error deleting task:", error.message);
          Swal.fire("Error!", "Failed to delete the task.", "error");
        }
      }
    });
  };

  const handleMarkCompleted = async (taskId: number) => {
    try {
      await fetch(`http://localhost:8080/api/user/${userId}/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workOfStatus: "completed" }),
      });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const applyFilters = () => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.priority?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
        const matchesStatus = statusFilter ? task.workOfStatus === statusFilter : true;

        return matchesSearch && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "deadline") return new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime();
        if (sortBy === "priority") return a.priority.localeCompare(b.priority);
        if (sortBy === "status") return a.workOfStatus.localeCompare(b.workOfStatus);
        return 0;
      });
  };

  const filteredTasks = applyFilters();
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#f5f7fa] shadow-lg rounded-2xl">
      {userDetails && (
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Task List for <span className="text-blue-900">{userDetails.username}</span>
        </h2>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-700 font-medium">
          Total Tasks: <span className="font-bold">{filteredTasks.length}</span>
        </div>
        <div className="text-gray-700 font-medium">
          Completed: <span className="font-bold">{filteredTasks.filter(task => task.workOfStatus === 'completed').length}</span> / {filteredTasks.length}
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-3 py-2 border rounded-md w-full md:w-1/3" />
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 border rounded-md w-full md:w-1/4">
          <option value="">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-md w-full md:w-1/4">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button onClick={() => setRefreshKey(prev => prev + 1)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Refresh</button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
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
          {currentTasks.map((task) => (
            <tr key={task.taskId} className={`border-b border-gray-200 hover:bg-gray-100 ${task.deadline && new Date(task.deadline) < new Date() && task.workOfStatus !== 'completed' ? 'bg-red-100' : ''}`}>
              <td className="py-2 px-4 text-gray-800 cursor-pointer">{task.taskName}</td>
              <td className="py-2 px-4 text-gray-700">{task.description}</td>
              <td className="py-2 px-4">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${task.priority === "HIGH" ? "bg-red-200 text-red-800" : task.priority === "MEDIUM" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>{task.priority || "No priority"}</span>
              </td>
              <td className="py-2 px-4 text-gray-700">{task.deadline || "No due date"}</td>
              <td className="py-2 px-4">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${task.workOfStatus === "completed" ? "bg-green-300 text-green-900" : "bg-yellow-300 text-yellow-900"}`}>{task.workOfStatus}</span>
              </td>
              <td className="py-2 px-4 text-gray-700">{task.assignedTo ? task.assignedTo.username : "Not Assigned"}</td>
              <td className="py-2 px-4 flex justify-center gap-3">
                <input type="checkbox" title="Mark as Completed" checked={task.workOfStatus === "completed"} onChange={() => handleMarkCompleted(task.taskId)} />
                <button className="text-blue-700 hover:text-blue-900 transition" onClick={() => handleEditTask(task.taskId)} title="Edit">✏️</button>
                <button className="text-red-600 hover:text-red-800 transition" onClick={() => handleDeleteTask(task.taskId)} title="Delete">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Prev</button>
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default AssignedTo;
