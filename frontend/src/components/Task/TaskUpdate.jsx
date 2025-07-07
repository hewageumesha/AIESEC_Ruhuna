import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const TaskUpdate = () => {
    const { id, taskId } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [task, setTask] = useState({
        taskId: Number(taskId),
        taskName: "",
        description: "",
        deadLine: "",
        workOfStatus: "pending",
        priority: "MEDIUM"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taskResponse = await fetch(`http://localhost:8080/api/user/${id}/task/${taskId}`);
                const taskData = await taskResponse.json();

                const usersResponse = await fetch("http://localhost:8080/api/user/users");
                const usersData = await usersResponse.json();

                const assignedUser = taskData.assignedTo
                    ? usersData.find((user) => user.id === taskData.assignedTo.userId)
                    : null;

                setTask({
                    ...taskData,
                    assignedTo: assignedUser,
                    deadLine: taskData.deadLine.split("T")[0]
                });

                setUsers(usersData);
                console.log("Fetched users:", usersData); // ✅ Add this
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id, taskId]);

    const handleUpdate = async () => {
        try {
            const updatePayload = {
                ...task,
                assignedTo: task.assignedTo ? { userId: task.assignedTo.id } : null,
                priority: task.priority || "MEDIUM"
            };

            const updateResponse = await fetch(
                `http://localhost:8080/api/user/${id}/${taskId}/`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatePayload)
                }
            );

            if (updateResponse.ok) {
                Swal.fire("Success!", "Task updated successfully", "success");
                navigate(`/user/${id}/TaskDashboard`);
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire("Error!", "Failed to update task", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleAssigneeChange = (e) => {
        const selectedUserId = parseInt(e.target.value);
        const selectedUser = users.find(u => u.id === selectedUserId) || null;
        setTask(prev => ({ ...prev, assignedTo: selectedUser }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Task #{taskId}</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                    <input
                        name="taskName"
                        value={task.taskName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={task.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md h-32 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            type="date"
                            name="deadLine"
                            value={task.deadLine}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            name="priority"
                            value={task.priority}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="workOfStatus"
                            value={task.workOfStatus}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                        <select
                            value={task.assignedTo?.id?.toString() || ""}
                            onChange={handleAssigneeChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Unassigned</option>
                            {users.map((user) => {
                                console.log("Rendering user:", user); // ✅ Debug each user
                                return (
                                    <option key={user.id} value={user.id.toString()}>
                                        {user.userName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => navigate(`/user/${id}/TaskList`)}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskUpdate;
