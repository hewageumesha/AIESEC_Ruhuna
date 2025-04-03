// EditTask.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditTask: React.FC = () => {
  const { userId, taskId } = useParams(); // Get userId and taskId from URL params
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [deadLine, setDeadline] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing task details to populate the form
    const fetchTaskData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/user/${userId}/task/${taskId}`);
        if (!response.ok) throw new Error('Failed to fetch task data');
        const taskData = await response.json();
        setTaskName(taskData.taskName);
        setDescription(taskData.description);
        setDeadline(taskData.deadLine);
        setStatus(taskData.workOfStatus); // Map the API status field to frontend status
        setPriority(taskData.priority);
      } catch (error) {
        console.error('Error fetching task data:');
      }
    };

    fetchTaskData();
  }, [userId, taskId]);

  const handleUpdateTask = async () => {
    const updatedTaskData = {
      taskName,
      description,
      deadLine,
      workOfStatus: status, // Map frontend status to backend field workOfStatus
      priority,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/user/${userId}/task/${taskId}`, {
        method: 'PUT', // Use PUT for updating the task
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTaskData),
      });

      if (response.ok) {
        Swal.fire('Success!', 'Task updated successfully!', 'success');
        navigate(`/user/${userId}/TaskList`); // Navigate back to task list after update
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:');
      Swal.fire('Error!', 'Failed to update the task.', 'error');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Edit Task</h2>
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
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button type="button" className="btn" onClick={handleUpdateTask}>
          Update Task
        </button>
      </div>
    </div>
  );
};

export default EditTask;
