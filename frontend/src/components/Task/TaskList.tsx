import React, { useEffect, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";

// Interfaces
interface User {
    id: string;
    username: string;
    numberOfTasks: number;
}

interface Task {
    taskId: number;
    taskName: string;
    deadLine: string;
    priority: string;
    workOfStatus: string;
    description: string;
    assignedTo?: User;
}

const TaskList: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPriority, setSelectedPriority] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    // Fetch user + tasks
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Fetching user from:", `http://localhost:8080/api/users/${id}/`);
                const userRes = await fetch(`http://localhost:8080/api/users/${id}/`);
                if (!userRes.ok) throw new Error("Failed to fetch user");
                const userData = await userRes.json();
                setUserDetails(userData);

                console.log("Fetching tasks from:", `http://localhost:8080/api/user/${id}/tasks/`);
                const tasksRes = await fetch(`http://localhost:8080/api/user/${id}/tasks/`);
                if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
                const userTasks = await tasksRes.json();
                console.log("Fetched tasks:", userTasks);
                setTasks(userTasks);
            } catch (err: any) {
                console.error("Fetch error:", err.message);
            }
        };
        fetchUserData();
    }, [id]);

    // Filters
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.taskName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.priority?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;
        const matchesStatus = selectedStatus ? task.workOfStatus === selectedStatus : true;

        return matchesSearch && matchesPriority && matchesStatus;
    });

    console.log("Filtered tasks to display:", filteredTasks);

    // Handlers
    const handleEditTask = (taskId: number) => {
        const editPath = generatePath("/users/:userId/tasks/:taskId/edit", {
            userId: id || "",
            taskId: taskId.toString(),
        });
        navigate(editPath);
    };

    const handleDeleteTask = (taskId: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this task?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#4a6fa5",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:8080/api/user/${id}/${taskId}/`, {
                        method: "DELETE",
                    });
                    if (!res.ok) throw new Error("Failed to delete task");
                    setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
                    Swal.fire("Deleted!", "Your task has been deleted.", "success");
                } catch (err: any) {
                    console.error("Delete error:", err.message);
                    Swal.fire("Error!", "Failed to delete task.", "error");
                }
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-sans">
            {userDetails && (
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6 text-center">
                    Task Overview for {userDetails.username}
                </h2>
            )}

            <p className="text-center text-gray-600 mb-8">
                Showing {filteredTasks.length} of {tasks.length} tasks
            </p>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                <input
                    type="text"
                    placeholder="🔍 Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-gray-200 shadow-md rounded-xl focus:ring-2 focus:ring-indigo-400"
                />
                <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-gray-200 shadow-md rounded-xl focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">All Priorities</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-gray-200 shadow-md rounded-xl focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            {/* Task Table */}
            {filteredTasks.length > 0 ? (
                <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100">
                    <table className="min-w-full text-sm text-left bg-white">
                        <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900">
                        <tr>
                            <th className="py-4 px-6">Task</th>
                            <th className="py-4 px-6">Description</th>
                            <th className="py-4 px-6">Priority</th>
                            <th className="py-4 px-6">Deadline</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6">Assigned To</th>
                            <th className="py-4 px-6 text-center">⚙️ Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTasks.map((task) => (
                            <tr
                                key={task.taskId}
                                className="border-t border-gray-100 hover:bg-indigo-50 transition"
                            >
                                <td className="px-6 py-3 font-medium text-gray-900">{task.taskName}</td>
                                <td className="px-6 py-3 text-gray-600">{task.description}</td>
                                <td className="px-6 py-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                            task.priority === "HIGH"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "MEDIUM"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                        }`}
                    >
                      {task.priority}
                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-700">
                                    {new Date(task.deadLine).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                            task.workOfStatus === "completed"
                                ? "bg-green-200 text-green-900"
                                : task.workOfStatus === "in-progress"
                                    ? "bg-yellow-200 text-yellow-900"
                                    : "bg-red-100 text-red-800"
                        }`}
                    >
                      {task.workOfStatus}
                    </span>
                                </td>
                                <td className="px-6 py-3 font-medium text-gray-800">
                                    {task.assignedTo?.username || "Not Assigned"}
                                </td>
                                <td className="px-6 py-3 flex justify-center gap-3">
                                    <button
                                        onClick={() => handleEditTask(task.taskId)}
                                        className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 p-2 rounded-full transition"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.taskId)}
                                        className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10 text-lg">
                    <img
                        src={require("../asset/notfound.gif")}
                        alt="sad"
                        className="inline-block w-16 h-16"
                        style={{ marginTop: "10px" }}
                    />{" "}
                    No tasks found
                </p>
            )}
        </div>
    );
};

export default TaskList;
