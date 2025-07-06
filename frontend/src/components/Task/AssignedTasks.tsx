import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaFlag } from "react-icons/fa";
import { MdOutlineSort, MdSort } from "react-icons/md";

// Type for Assigned User
interface AssignedByUser {
    id: number;
    username: string;
    role?: string;
}

// Type for Task
interface Task {
    taskId: number;
    taskName: string;
    description: string;
    priority: string;
    deadLine: string;
    workOfStatus: string;
    assignedBy?: AssignedByUser;
}

const AssignedTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [priorityFilter, setPriorityFilter] = useState<string>("All");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [proofNotes, setProofNotes] = useState<{ [key: number]: string }>({});


    // Get logged-in id
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const id = user.userId;

    // Fetch tasks on mount
    useEffect(() => {
        if (id) fetchTasks();
    }, [id]);

    // API: Fetch tasks assigned to current user
    const fetchTasks = () => {
        axios
            .get(`http://localhost:8080/api/user/${id}/assigned/`)
            .then((res) => {
                console.log("✅ Raw tasks from backend:", res.data); // 👈 see the fetched data
                setTasks(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("❌ Error fetching tasks:", err);
                Swal.fire("Error", "Could not load tasks.", "error");
                setLoading(false);
            });
    };


    // Style color for priority
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH": return "bg-red-200";
            case "MEDIUM": return "bg-yellow-200";
            case "LOW": return "bg-green-300";
            default: return "bg-gray-200";
        }
    };

    // Style color for status
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-red-200";
            case "in-progress": return "bg-yellow-200";
            case "completed": return "bg-green-200";
            default: return "bg-gray-200";
        }
    };

    // Calculate remaining days or overdue
    const getDaysRemaining = (deadline: string): string => {
        const today = new Date();
        const dueDate = new Date(deadline);
        const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return diff >= 0 ? `${diff} day(s) left` : `Overdue by ${Math.abs(diff)} day(s)`;
    };

    // API: Update task status
    const handleStatusChange = async (taskId: number, newStatus: string) => {
        try {
            await axios.put(`http://localhost:8080/api/task/${taskId}/updateStatus`, null, {
                params: { status: newStatus },
            });

            setTasks((prev) =>
                prev.map((task) => task.taskId === taskId ? { ...task, workOfStatus: newStatus } : task)
            );

            Swal.fire("Updated", "Task status updated successfully!", "success");
        } catch (error) {
            console.error("Status update failed:", error);
            Swal.fire("Error", "Failed to update status", "error");
        }
    };

    // API: Upload proof file and note
    const handleFileUpload = async (taskId: number, file: File) => {
        const formData = new FormData();
        formData.append("proof", file);
        formData.append("note", proofNotes[taskId] || "");

        try {
            await axios.post(
                `http://localhost:8080/api/task/${taskId}/uploadProof`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            Swal.fire("Success", "Proof uploaded successfully!", "success");
        } catch (error) {
            console.error("Upload error:", error);
            Swal.fire("Error", "Failed to upload proof.", "error");
        }
    };

    // Filter tasks based on search, priority, status
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.priority?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
        const matchesStatus = statusFilter === "All" || task.workOfStatus === statusFilter;

        return matchesSearch && matchesPriority && matchesStatus;
    });

    return (
        <div className="p-8 rounded-lg shadow-xl" style={{ backgroundColor: "rgba(195,217,215,0.31)", color: "#070707" }}>
            <h2 className="text-3xl font-bold mb-6 text-center">Assigned Tasks</h2>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <input
                    type="text"
                    className="px-4 py-2 rounded-lg w-full md:w-1/2 text-black"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="flex gap-4">
                    {/* Priority Filter */}
                    <div className="flex items-center gap-2">
                        <MdOutlineSort className="text-white" />
                        <label className="font-semibold text-lg">Priority:</label>
                        <select
                            className="px-4 py-2 rounded-md bg-gray-200 text-black"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <MdSort className="text-white" />
                        <label className="font-semibold text-lg">Status:</label>
                        <select
                            className="px-4 py-2 rounded-md bg-gray-200 text-black"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Task Display Table */}
            {loading ? (
                <div className="text-center text-xl animate-pulse">
                    <img src={require("../asset/notfound.gif")} alt="loading" className="inline-block w-16 h-16 mt-2" />
                    Loading tasks...
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center text-lg italic">
                    <img src={require("../asset/notfound.gif")} alt="not found" className="inline-block w-16 h-16 mt-2" />
                    No matching tasks found.
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full table-auto text-left text-gray-800">
                        <thead style={{ backgroundColor: "#0CB9C1" }}>
                        <tr className="text-white text-lg">
                            <th className="px-6 py-4">Task Name</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Deadline</th>
                            <th className="px-6 py-4">Days Left</th>
                            <th className="px-6 py-4">Assigned By</th>
                            <th className="px-6 py-4">Upload Proof</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredTasks.map((task) => (
                            <tr key={task.taskId} className="hover:bg-blue-50">
                                <td className="px-6 py-3">{task.taskName}</td>
                                <td className="px-6 py-3">{task.description}</td>
                                <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-black font-semibold text-sm ${getPriorityColor(task.priority)}`}>
                      <FaFlag />
                        {task.priority}
                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <select
                                        value={task.workOfStatus}
                                        onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
                                        className={`px-2 py-1 rounded-md text-sm font-semibold ${getStatusColor(task.workOfStatus)} text-black`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>
                                <td className="px-6 py-3">{new Date(task.deadLine).toLocaleDateString()}</td>
                                <td className="px-6 py-3 text-sm text-gray-700">{getDaysRemaining(task.deadLine)}</td>
                                <td className="px-6 py-3">
                                    {task.assignedBy?.username ? (
                                        <span title={`Role: ${task.assignedBy.role || "Unknown"}`}>{task.assignedBy.username}</span>
                                    ) : (
                                        <i className="text-red-500">Unknown</i>
                                    )}
                                </td>
                                <td className="px-6 py-3">
                    <textarea
                        placeholder="Enter proof note..."
                        value={proofNotes[task.taskId] || ""}
                        onChange={(e) =>
                            setProofNotes((prev) => ({ ...prev, [task.taskId]: e.target.value }))
                        }
                        className="mb-2 w-full p-1 rounded-md border border-gray-400 text-black"
                    />
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(task.taskId, file);
                                        }}
                                        className="px-2 py-1 rounded-md bg-blue-200 text-black"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AssignedTasks;
