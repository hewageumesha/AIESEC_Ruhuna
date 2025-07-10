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
        priority: "MEDIUM",
        assignedBy: null,      // keep assignedBy info for filtering users
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🔥 Fixed URL to use assigner id
                const taskResponse = await fetch(`http://localhost:8080/api/user/${id}/task/${taskId}`);
                if (!taskResponse.ok) {
                    throw new Error("Task not found");
                }
                const taskData = await taskResponse.json();

                const usersResponse = await fetch("http://localhost:8080/api/user/users");
                const usersData = await usersResponse.json();

                const assignedUser = taskData.assignedTo
                    ? usersData.find((user) => user.id === taskData.assignedTo.id)
                    : null;

                setTask({
                    ...taskData,
                    assignedTo: assignedUser,
                    deadLine: taskData.deadLine?.split("T")[0] || ""
                });

                setUsers(usersData);

                console.log("Fetched task:", taskData);
                console.log("Resolved assigned user:", assignedUser);
            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire("Error!", "Could not load task", "error");
            }
        };

        fetchData();
    }, [id, taskId]);


    const handleUpdate = async () => {
        try {
            const updatePayload = {
                ...task,
                assignedTo: task.assignedTo ? { id: task.assignedTo.id } : null,
                priority: task.priority || "MEDIUM",
            };

            const updateResponse = await fetch(
                `http://localhost:8080/api/user/${id}/${taskId}/`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatePayload),
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
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleAssigneeChange = (e) => {
        const selectedUserId = parseInt(e.target.value);
        const selectedUser = users.find((u) => u.id === selectedUserId) || null;
        setTask((prev) => ({ ...prev, assignedTo: selectedUser }));
    };

    return (
        <div className="create-task-wrapper">
            <h2 className="create-task-title">Edit Task #{taskId}</h2>

            <div className="task-step">
                <div className="form-group">
                    <label>Task Name</label>
                    <input
                        name="taskName"
                        value={task.taskName}
                        onChange={handleInputChange}
                        className="form-input"
                        style={{ color: "black", backgroundColor: "white" }}
                    />
                </div>

                <div className="form-group col-span-2">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={task.description}
                        onChange={handleInputChange}
                        className="form-input h-32"
                        style={{ color: "black", backgroundColor: "white" }}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Deadline</label>
                    <input
                        type="date"
                        name="deadLine"
                        value={task.deadLine}
                        onChange={handleInputChange}
                        className="form-input"
                        style={{ color: "black", backgroundColor: "white" }}
                    />
                </div>

                <div className="form-group">
                    <label>Priority</label>
                    <select
                        name="priority"
                        value={task.priority}
                        onChange={handleInputChange}
                        className="form-input"
                        style={{ color: "black", backgroundColor: "white" }}
                    >
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Assign To</label>
                    <select
                        value={task.assignedTo?.id?.toString() || ""}
                        onChange={handleAssigneeChange}
                        className="form-input"
                    >
                        <option value="">Unassigned</option>
                        {users
                            .filter((user) => {
                                if (!user || !task.assignedBy) return false;

                                const sameDepartment =
                                    user.departmentId === task.assignedBy.departmentId;
                                const sameFunction = task.assignedBy.functionId?.id
                                    ? user.functionId?.id === task.assignedBy.functionId?.id
                                    : true;

                                if (task.assignedBy.role === "LCP") {
                                    return ["LCVP", "Team_Leader", "Member"].includes(user.role);
                                }

                                if (task.assignedBy.role === "LCVP") {
                                    return (
                                        ["Team_Leader", "Member"].includes(user.role) &&
                                        sameDepartment &&
                                        sameFunction
                                    );
                                }

                                if (task.assignedBy.role === "Team_Leader") {
                                    return user.role === "Member" && sameDepartment && sameFunction;
                                }

                                return false;
                            })
                            .map((user) => (
                                <option key={user.id} value={user.id.toString()}>
                                    {user.userName} ({user.role})
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={() => navigate(`/user/${id}/TaskList`)}
                    className="border border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
                <button onClick={handleUpdate} className="btn-submit">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default TaskUpdate;
