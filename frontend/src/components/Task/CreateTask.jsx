// Importing necessary React hooks and modules
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ClipboardList,
    FileText,
    CalendarDays,
    Flag,
    RefreshCw,
    UserPlus,
    UserCheck
} from 'lucide-react';
import './TaskStyles/CreateTask.css';
import Swal from "sweetalert2";

const CreateTask = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [deadLine, setDeadline] = useState('');
    const [status, setStatus] = useState('pending'); // ✅ default pending
    const [priority, setPriority] = useState('MEDIUM');
    const [users, setUsers] = useState([]);
    const [assignTo, setAssignTo] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/users')
            .then((res) => res.json())
            .then((data) => {
                console.log("Users fetched: ", data);
                if (Array.isArray(data)) setUsers(data);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/api/users/profile/id/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("Logged in user: ", data);
                setLoggedInUser(data);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleCreateTask = () => {
        if (!taskName || !description || !deadLine || !status || !assignTo) {
            Swal.fire('Validation Error', 'Please fill all required fields', 'warning');
            return;
        }

        if (description.length > 300) {
            Swal.fire('Too Long', 'Description cannot exceed 300 characters.', 'error');
            return;
        }

        const taskData = {
            taskName,
            description,
            deadLine,
            workOfStatus: status,
            priority,
            assignedTo: {
                id: assignTo,
                username: "",
                numberOfTasks: 0
            },
        };

        fetch(`http://localhost:8080/api/user/${id}/task/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        })
            .then((res) => {
                if (res.ok) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Task created successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate(`/user/${id}/TaskDashboard`);
                    });
                } else {
                    throw new Error('Task creation failed');
                }
            })
            .catch((err) => {
                console.error('Error creating task:', err);
                navigate('/*');
            });
    };

    return (
        <div className="create-task-wrapper">
            <h2 className="create-task-title">Create New Task</h2>

            {/* Step 1: Task Details */}
            <div className="task-step">
                <div className="step-header">
                    <ClipboardList className="step-icon" />
                    <span>Task Details</span>
                </div>

                <div className="form-group">
                    <label><FileText className="icon" /> Task Name</label>
                    <input
                        className="form-input"
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    />
                </div>

                <div className="form-group">
                    <label><FileText className="icon" /> Description</label>
                    <textarea
                        className="form-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    />
                </div>
            </div>

            {/* Step 2: Timing and Priority */}
            <div className="task-step">
                <div className="step-header">
                    <CalendarDays className="step-icon" />
                    <span>Timing & Priority</span>
                </div>

                <div className="form-group">
                    <label><CalendarDays className="icon" /> Deadline</label>
                    <input
                        className="form-input"
                        type="date"
                        value={deadLine}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDeadline(e.target.value)}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    />
                </div>

                <div className="form-group">
                    <label><Flag className="icon" /> Priority</label>
                    <select
                        className="form-input"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    >
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
            </div>

            {/* Step 3: Work Status and Assignment */}
            <div className="task-step">
                <div className="step-header">
                    <UserPlus className="step-icon" />
                    <span>Work Status & Assign</span>
                </div>

                <div className="form-group">
                    <label><RefreshCw className="icon" /> Work Status</label>
                    <select
                        className="form-input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    >
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <div className="form-group">
                    <label><UserPlus className="icon" /> Assign To</label>
                    <select
                        className="form-input"
                        value={assignTo}
                        onChange={(e) => setAssignTo(Number(e.target.value))}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    >
                        <option value="">Select User</option>
                        {users
                            .filter(user => {
                                if (!loggedInUser) return false;
                                if (loggedInUser.role === "LCP") {
                                    return ["LCVP", "Team_Leader", "Member"].includes(user.role);
                                }
                                if (loggedInUser.role === "LCVP") {
                                    return ["Team_Leader", "Member"].includes(user.role) &&
                                        user.departmentId === loggedInUser.departmentId;
                                }
                                if (loggedInUser.role === "Team_Leader") {
                                    return user.role === "Member" &&
                                        user.departmentId === loggedInUser.departmentId;
                                }
                                return false;
                            })
                            .map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.userName} ({user.role} - {user.departmentName})
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <button className="btn-submit" onClick={handleCreateTask}>
                <UserCheck className="inline-block mr-2" />
                Create Task
            </button>
        </div>
    );
};

export default CreateTask;
