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
    const [status, setStatus] = useState('pending'); // default pending
    const [priority, setPriority] = useState('MEDIUM');
    const [users, setUsers] = useState([]);
    const [assignTo, setAssignTo] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    // New filter states
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedFunction, setSelectedFunction] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/user/users')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setUsers(data);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/api/users/profile/id/${id}`)
            .then(res => res.json())
            .then(data => {
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

    // Unique filter values
    const departmentOptions = [...new Set(users.map(u => u.departmentName).filter(Boolean))];
    const functionOptions = [...new Set(users.map(u => u.functionName).filter(Boolean))];

    // Role options depending on logged-in user role
    let roleOptions = [];
    if (loggedInUser?.role === "LCP") {
        roleOptions = ["LCVP", "Team_Leader", "Member"];
    } else if (loggedInUser?.role === "LCVP") {
        roleOptions = ["Team_Leader", "Member"];
    } else if (loggedInUser?.role === "Team_Leader") {
        roleOptions = ["Member"];
    }

    return (
        <div className="create-task-wrapper">
            <button
                className="btn-back"
                onClick={() => navigate(-1)}
                style={{
                    backgroundColor: "#3498db",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "16px"
                }}
            >
                ← Back
            </button>
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

            {/* Step 3: Work Status */}
            <div className="task-step">
                <div className="step-header">
                    <RefreshCw className="step-icon" />
                    <span>Work Status</span>
                </div>
                <div className="form-group">
                    <select
                        className="form-input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    >
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Step 4: Assign To */}
            <div className="task-step">
                <div className="step-header">
                    <UserPlus className="step-icon" />
                    <span>Assign To</span>
                </div>

                {/* Department Filter */}

                <div className="form-group">
                    <label>Department</label>
                    <select
                        className="form-input"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    >
                        <option value="">All Offices</option>
                        {departmentOptions.map(dep => (
                            <option key={dep} value={dep}>{dep}</option>
                        ))}
                    </select>
                </div>


                {/* Role Filter */}
                <div className="form-group">
                    <label>Role</label>
                    <select
                        className="form-input"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    >
                        <option value="">All Roles</option>
                        {roleOptions.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                {/* Function Filter */}
                <div className="form-group">
                    <label>Function</label>
                    <select
                        className="form-input"
                        value={selectedFunction}
                        onChange={(e) => setSelectedFunction(e.target.value)}
                        style={{ color: 'black', backgroundColor: 'white' }}
                    >
                        <option value="">All Functions</option>
                        {functionOptions.map(func => (
                            <option key={func} value={func}>{func}</option>
                        ))}
                    </select>
                </div>

                {/* Assign To Dropdown */}
                <div className="form-group">
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

                                const depMatch = selectedDepartment
                                    ? user.departmentName === selectedDepartment
                                    : true;

                                const roleMatch = selectedRole
                                    ? user.role?.toLowerCase() === selectedRole.toLowerCase()
                                    : true;

                                const funcMatch = selectedFunction
                                    ? user.functionName === selectedFunction
                                    : true;

                                const sameFunction = (!user.functionId?.id && !loggedInUser.functionId?.id)
                                    || (user.functionId?.id === loggedInUser.functionId?.id);

                                if (loggedInUser.role === "LCP") {
                                    return ["LCVP", "Team_Leader", "Member"].includes(user.role) && depMatch && roleMatch && funcMatch;
                                }
                                if (loggedInUser.role === "LCVP") {
                                    return ["Team_Leader", "Member"].includes(user.role) && depMatch && sameFunction && roleMatch && funcMatch;
                                }
                                if (loggedInUser.role === "Team_Leader") {
                                    return user.role === "Member" && depMatch && sameFunction && roleMatch && funcMatch;
                                }
                                return false;
                            })
                            .map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName} ({user.role} - {user.functionName})
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
