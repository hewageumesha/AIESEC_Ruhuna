import React, { useEffect, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";
import notfound from "../asset/notfound.gif";

const TaskList = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [assignedToFilter, setAssignedToFilter] = useState("");
    const [deadlineFrom, setDeadlineFrom] = useState("");
    const [deadlineTo, setDeadlineTo] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    console.log('Task completedAt:', tasks.completedAt);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRes = await fetch(`https://aiesecinruhuna-production.up.railway.app/api/users/id/${id}`);
                if (!userRes.ok) throw new Error("Failed to fetch user");
                const userData = await userRes.json();
                setUserDetails(userData);

                const tasksRes = await fetch(`https://aiesecinruhuna-production.up.railway.app/api/user/${id}/tasks/`);
                if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
                const userTasks = await tasksRes.json();
                setTasks(userTasks);
            } catch (err) {
                console.error("Fetch error:", err.message);
            }
        };
        fetchUserData();
    }, [id]);

    const assignedUsers = Array.from(
        new Set(tasks.map((task) => task.assignedTo?.firstName).filter(Boolean))
    );

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.taskName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.priority?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;
        const matchesStatus = selectedStatus ? task.workOfStatus === selectedStatus : true;
        const matchesAssignedTo = assignedToFilter ? task.assignedTo?.firstName === assignedToFilter : true;

        const taskDeadline = task.deadLine ? new Date(task.deadLine) : null;
        const fromDate = deadlineFrom ? new Date(deadlineFrom) : null;
        const toDate = deadlineTo ? new Date(deadlineTo) : null;

        let matchesDeadline = true;
        if (taskDeadline && fromDate) matchesDeadline = matchesDeadline && taskDeadline >= fromDate;
        if (taskDeadline && toDate) matchesDeadline = matchesDeadline && taskDeadline <= toDate;

        return matchesSearch && matchesPriority && matchesStatus && matchesAssignedTo && matchesDeadline;
    });

    const handleEditTask = (taskId) => {
        const editPath = generatePath("/users/:userId/tasks/:taskId/edit", {
            userId: id || "",
            taskId: taskId.toString(),
        });
        navigate(editPath);
    };

    const handleDeleteTask = (taskId) => {
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
                    const res = await fetch(`https://aiesecinruhuna-production.up.railway.app/api/user/${id}/${taskId}/`, {
                        method: "DELETE",
                    });
                    if (!res.ok) throw new Error("Failed to delete task");
                    setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
                    Swal.fire("Deleted!", "Your task has been deleted.", "success");
                } catch (err) {
                    console.error("Delete error:", err.message);
                    Swal.fire("Error!", "Failed to delete task.", "error");
                }
            }
        });
    };

    const openMoreModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const closeMoreModal = () => {
        setSelectedTask(null);
        setShowModal(false);
    };

    const handleDownload = async (filePath) => {
        try {
            // ensure it always starts with /
            const path = filePath.startsWith('/') ? filePath : `/${filePath}`;
            const response = await fetch(`https://aiesecinruhuna-production.up.railway.app${path}`);
            if (!response.ok) throw new Error("Failed to download file");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filePath.split("/").pop());
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download error:", err);
        }
    };


    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-sans">

            <button
                onClick={() => navigate(-1)}  // Goes back one step in history
                className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded shadow-sm"
            >
                ← Back
            </button>
            {userDetails && (
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6 text-center">
                    Task Overview for {userDetails.firstName}
                </h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                <input
                    type="text"
                    placeholder="🔍 Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-gray-200 shadow-md rounded-xl focus:ring-2 focus:ring-indigo-400"
                />
                <input
                    type="date"
                    value={deadlineFrom}
                    onChange={(e) => setDeadlineFrom(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-gray-200 shadow-md rounded-xl focus:ring-2 focus:ring-indigo-400"
                />
                <input
                    type="date"
                    value={deadlineTo}
                    onChange={(e) => setDeadlineTo(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-gray-200 shadow-md rounded-xl focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-100">
                <table className="min-w-full text-sm text-left bg-white">
                    <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900">
                    <tr>
                        <th className="py-4 px-6 whitespace-nowrap">Task</th>
                        <th className="py-4 px-6 whitespace-nowrap">Description</th>
                        <th className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                                Priority
                                <select
                                    value={selectedPriority}
                                    onChange={(e) => setSelectedPriority(e.target.value)}
                                    className="w-5 h-5 p-0 border border-gray-300 rounded cursor-pointer text-transparent focus:text-black focus:outline-none"
                                    title="Filter by Priority"
                                >
                                    <option value=""></option>
                                    <option value="HIGH" className="text-black">High</option>
                                    <option value="MEDIUM" className="text-black">Medium</option>
                                    <option value="LOW" className="text-black">Low</option>
                                </select>
                            </div>
                        </th>
                        <th className="py-4 px-6 whitespace-nowrap">Deadline</th>
                        <th className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                                Status
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-5 h-5 p-0 border border-gray-300 rounded cursor-pointer text-transparent focus:text-black focus:outline-none"
                                    title="Filter by Status"
                                >
                                    <option value=""></option>
                                    <option value="completed" className="text-black">Completed</option>
                                    <option value="in-progress" className="text-black">In Progress</option>
                                    <option value="pending" className="text-black">Pending</option>
                                </select>
                            </div>
                        </th>
                        <th className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                                Assigned To
                                <select
                                    value={assignedToFilter}
                                    onChange={(e) => setAssignedToFilter(e.target.value)}
                                    className="w-5 h-5 p-0 border border-gray-300 rounded cursor-pointer text-transparent focus:text-black focus:outline-none"
                                    title="Filter by Assigned To"
                                >
                                    <option value=""></option>
                                    {assignedUsers.map((firstName) => (
                                        <option key={firstName} value={firstName} className="text-black">
                                            {firstName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </th>
                        <th className="py-4 px-6 text-center whitespace-nowrap">More</th>
                        <th className="py-4 px-6 text-center whitespace-nowrap">⚙️ Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <tr key={task.taskId} className="border-t border-gray-100 hover:bg-indigo-50 transition">
                                <td className="px-6 py-3 font-medium text-gray-900">{task.taskName}</td>
                                <td className="px-6 py-3 text-gray-600">{task.description}</td>
                                <td className="px-6 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                                            task.priority === "HIGH"
                                                ? "bg-red-100 text-red-800"
                                                : task.priority === "MEDIUM"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-green-100 text-green-700"
                                        }`}>{task.priority}</span>
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
        title={
            task.workOfStatus === "completed" && task.completedAt
                ? `Completed at: ${new Date(task.completedAt).toLocaleString()}`
                : ""
        }
    >
        {task.workOfStatus}
    </span>
                                </td>

                                <td className="px-6 py-3 font-medium text-gray-800">
                                    {task.assignedTo?.firstName || "Not Assigned"}
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <button
                                        onClick={() => openMoreModal(task)}
                                        className="text-indigo-600 hover:text-indigo-800 underline"
                                    >
                                        More
                                    </button>
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-8">
                                <img src={notfound} alt="sad" className="inline-block w-16 h-16 mb-3" />
                                <p className="text-gray-500 text-lg">No tasks found</p>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {showModal && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white text-gray-800 rounded-lg p-6 max-w-lg w-full shadow-lg relative">
                        <button
                            onClick={closeMoreModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
                        >
                            ✖
                        </button>
                        <h3 className="text-xl font-semibold mb-4">Task Details</h3>
                        <p><strong>Note:</strong> {selectedTask.note || "No note provided."}</p>
                        <p className="mt-3">
                            <strong>Proof Document:</strong>{" "}
                            {selectedTask.filePath ? (
                                <button
                                    onClick={() => handleDownload(selectedTask.filePath)}
                                    className="text-indigo-600 hover:underline"
                                >
                                    Download Document
                                </button>
                            ) : (
                                "No proof document uploaded."
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
