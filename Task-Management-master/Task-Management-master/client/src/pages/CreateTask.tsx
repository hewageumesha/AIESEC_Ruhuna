import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateTask.css'; // Import external CSS

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [deadLine, setDeadline] = useState('');
  const [workOfStatus, setWorkStatus] = useState('');
  const [priority, setPriority] = useState('MEDIUM'); // Default Priority
  const { userId } = useParams();

  const handleCreateTask = () => {
    const createTaskData = {
      taskName,
      description,
      deadLine,
      workOfStatus,
      priority, // Added Priority Field
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
          value={workOfStatus}
          onChange={(e) => setWorkStatus(e.target.value)}
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button type="button" className="btn" onClick={handleCreateTask}>
          Create Task
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
