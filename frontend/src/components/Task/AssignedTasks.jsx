import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaFlag } from "react-icons/fa";
import { MdOutlineSort, MdSort } from "react-icons/md";
import notfoundGif from "../asset/notfound.gif";

const AssignedTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [proofNotes, setProofNotes] = useState({});
    const [assignedByFilter, setAssignedByFilter] = useState("All");
    const [deadlineSort, setDeadlineSort] = useState("asc");


    // Safely parse user from localStorage
    let user = {};
    try {
        user = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        user = {};
    }
    const id = user?.id;

    useEffect(() => {
        if (id) fetchTasks();
    }, [id]);

    const fetchTasks = () => {
        console.log("Fetching tasks for userId:", id);
        axios
            .get(`http://localhost:8080/api/user/${id}/assigned/`)
            .then((res) => {
                console.log("✅ Raw tasks from backend:", res.data);
                setTasks(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("❌ Error fetching tasks:", err);
                Swal.fire("Error", "Could not load tasks.", "error");
                setLoading(false);
            });
    };

    const getPriorityColor = (priority) => {
        switch ((priority || "").toUpperCase()) {
            case "HIGH":
                return "bg-red-200";
            case "MEDIUM":
                return "bg-yellow-200";
            case "LOW":
                return "bg-green-300";
            default:
                return "bg-gray-200";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-red-200";
            case "in-progress":
                return "bg-yellow-200";
            case "completed":
                return "bg-green-200";
            default:
                return "bg-gray-200";
        }
    };

    const getDaysRemaining = (deadline) => {
        const today = new Date();
        const dueDate = new Date(deadline);
        const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return diff >= 0 ? `${diff} day(s) left` : `Overdue by ${Math.abs(diff)} day(s)`;
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:8080/api/user/task/${taskId}/updateStatus`,
                null,
                { params: { status: newStatus } }
            );

            setTasks((prev) =>
                prev.map((task) =>
                    task.taskId === taskId ? { ...task, workOfStatus: newStatus } : task
                )
            );

            Swal.fire("Updated", "Task status updated successfully!", "success");
        } catch (error) {
            console.error("Status update failed:", error);
            Swal.fire("Error", "Failed to update status", "error");
        }
    };

    const handleFileUpload = async (taskId, file) => {
        const formData = new FormData();
        formData.append("proof", file);
        formData.append("note", proofNotes[taskId] || "");
        formData.append("id", id);

        try {
            await axios.post(`http://localhost:8080/api/user/task/${taskId}/upload-proof`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire("Success", "Proof uploaded successfully!", "success");
        } catch (error) {
            console.error("Upload error:", error);
            Swal.fire("Error", "Failed to upload proof.", "error");
        }
    };

    // Filter tasks based on search, priority, and status
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.priority?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
        const matchesStatus = statusFilter === "All" || task.workOfStatus === statusFilter;

        return matchesSearch && matchesPriority && matchesStatus;
    });

    // Sort filtered tasks by deadline ascending
    const sortedTasks = [...filteredTasks].sort(
        (a, b) => new Date(a.deadLine) - new Date(b.deadLine)
    );

    return (
        <div
            className="p-8 rounded-lg shadow-xl"
            style={{ backgroundColor: "rgba(195,217,215,0.31)", color: "#070707" }}
        >
            <h2 className="text-3xl font-bold mb-6 text-center">Assigned Tasks</h2>

            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <input
                    type="text"
                    className="px-4 py-2 rounded-lg w-full md:w-1/2 text-black"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <MdOutlineSort className="text-black" />
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

                    <div className="flex items-center gap-2">
                        <MdSort className="text-black" />
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

            {loading ? (
                <div className="text-center text-xl animate-pulse">
                    <img src={notfoundGif} alt="loading" className="inline-block w-16 h-16 mt-2" />
                    Loading tasks...
                </div>
            ) : sortedTasks.length === 0 ? (
                <div className="text-center text-lg italic">
                    <img src={notfoundGif} alt="not found" className="inline-block w-16 h-16 mt-2" />
                    No matching tasks found.
                </div>
            ) : (
                <div className="overflow-x-auto max-h-[70vh] bg-white rounded-lg shadow-md">
                    <table className="min-w-full table-auto text-left text-gray-800">
                        <thead style={{ backgroundColor: "#0CB9C1" }}>
                        <tr className="text-white text-lg">
                            <th className="px-6 py-4 whitespace-nowrap">Task Name</th>
                            <th className="px-6 py-4 whitespace-nowrap">Description</th>

                            <th className="px-6 py-4 whitespace-nowrap">
                                <div className="inline-flex items-center gap-1">
                                    Priority
                                    <select
                                        className="w-20 p-0.5 rounded text-black text-sm"
                                        onChange={(e) => setPriorityFilter(e.target.value)}
                                        value={priorityFilter}
                                    >
                                        <option value="All">All</option>
                                        <option value="HIGH">High</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="LOW">Low</option>
                                    </select>
                                </div>
                            </th>

                            <th className="px-6 py-4 whitespace-nowrap">
                                <div className="inline-flex items-center gap-1">
                                    Status
                                    <select
                                        className="w-24 p-0.5 rounded text-black text-sm"
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        value={statusFilter}
                                    >
                                        <option value="All">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </th>

                            <th className="px-6 py-4 whitespace-nowrap">
                                <div className="inline-flex items-center gap-1">
                                    Deadline
                                    <button
                                        onClick={() => setDeadlineSort((prev) => (prev === "asc" ? "desc" : "asc"))}
                                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 text-black text-xs"
                                    >
                                        {deadlineSort === "asc" ? "↑" : "↓"}
                                    </button>
                                </div>
                            </th>

                            <th className="px-6 py-4 whitespace-nowrap">Days Left</th>

                            <th className="px-6 py-4 whitespace-nowrap">
                                <div className="inline-flex items-center gap-1">
                                    Assigned By
                                    <select
                                        className="w-20 p-0.5 rounded text-black text-sm"
                                        onChange={(e) => setAssignedByFilter(e.target.value)}
                                        value={assignedByFilter}
                                    >
                                        <option value="All">All</option>
                                        {Array.from(new Set(tasks.map((t) => t.assignedBy?.username || "Unknown")))
                                            .filter(name => name !== "Unknown")
                                            .map((name, idx) => (
                                                <option key={idx} value={name}>{name}</option>
                                            ))}
                                    </select>
                                </div>
                            </th>

                            <th className="px-6 py-4 whitespace-nowrap">Upload Proof</th>
                        </tr>
                        </thead>



                        <tbody className="divide-y divide-gray-200">
                        {sortedTasks.map((task) => (
                            <tr key={task.taskId} className="hover:bg-blue-50">
                                <td className="px-6 py-3">{task.taskName}</td>
                                <td className="px-6 py-3">{task.description}</td>
                                <td className="px-6 py-3">
                    <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-black font-semibold text-sm ${getPriorityColor(
                            task.priority
                        )}`}
                    >
                      <FaFlag />
                        {task.priority}
                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <select
                                        value={task.workOfStatus}
                                        onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
                                        className={`px-2 py-1 rounded-md text-sm font-semibold ${getStatusColor(
                                            task.workOfStatus
                                        )} text-black`}
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
                                        <span>{task.assignedBy.username}</span>
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
                                            // Optionally reset the file input here if needed with a ref
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
