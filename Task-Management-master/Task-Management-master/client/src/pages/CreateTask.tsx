import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateTask.css'; // Import external CSS

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [deadLine, setDeadline] = useState('');
  const [status, setStatus] = useState(''); // Use frontend-friendly name
  const [priority, setPriority] = useState('MEDIUM'); // Default Priority
  const [users, setUsers] = useState<any[]>([]); // State to store users
  const [assignTo, setAssignTo] = useState<number | string>(''); // For assigning user to task
  const { userId } = useParams();

  // Fetch users when the component mounts
  useEffect(() => {
    fetch('http://localhost:8080/api/user/users') // Adjust URL if needed
      .then((response) => response.json())
      .then((data) => {
        // Check if data is an array
        if (Array.isArray(data)) {
          setUsers(data); // Store users array
        } else {
          console.error('Invalid data format:', data);
        }
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleCreateTask = () => {
    console.log('Assigned to:', assignTo); // Log the selected userId
  
    const createTaskData = {
      taskName,
      description,
      deadLine,
      workOfStatus: status, // Map frontend-friendly status to backend field workOfStatus
      priority,
      assignedTo: assignTo, // Make sure this is the correct field being sent
    };
  
    fetch(`http://localhost:8080/api/user/${userId}/task/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createTaskData),
    })
      .then((response) => {
        if (response.ok) {
          navigate(`/user/${userId}/TaskList`);
        } else {
          throw new Error('Failed to create task');
        }
      })
      .catch((error) => {
        console.error('Error creating task:', error.message);
        navigate(`/*`);
      });
  };

  return (
    <div className="container">
      <h2 className="title">Create New Task</h2>
      <div className="form-container">
        <label className="form-label">Task Name:</label>
        <input
          className="form-input"
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />

        <label className="form-label">Description:</label>
        <textarea
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label className="form-label">Deadline:</label>
        <input
          className="form-input"
          type="date"
          value={deadLine}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        <label className="form-label">Priority:</label>
        <select
          className="form-input"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <label className="form-label">Work Status:</label>
        <select
          className="form-input"
          value={status} // Use frontend-friendly name
          onChange={(e) => setStatus(e.target.value)} // Update frontend status
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <label className="form-label">Assign To:</label>
        <select
          className="form-input"
          value={assignTo}
          onChange={(e) => setAssignTo(Number(e.target.value))}
        >
          <option value="">Select User</option>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.userName}
              </option>
            ))
          ) : (
            <option value="" disabled>No users available</option>
          )}
        </select>

        <button type="button" className="btn" onClick={handleCreateTask}>
          Create Task
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
