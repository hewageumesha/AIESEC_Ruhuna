import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskList from "./TaskList";
import AssignedTasksList from "../AssignedTasksList";

const Home: React.FC = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState("Krish");
  const [numberOfTasks, setNumberOfTasks] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}/`);
        if (response.ok) {
          const userDetails = await response.json();
          setUsername(userDetails.userName);
          setNumberOfTasks(userDetails.noOfTask);
        } else {
          throw new Error("Failed to fetch user details");
        }
      } catch (error: any) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleShowAllTasks = () => {
    navigate(`/user/${userId}/TaskList`);
  };

  const handleCreateTask = () => {
    navigate(`/user/${userId}/CreateTask`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">Task Management</h2>
          <button 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-600"
            onClick={handleCreateTask}
          >
            <span className="mr-2">+</span> Create Task
          </button>
        </div>
       

        <TaskList />
        <AssignedTasksList/>

        <div className="flex justify-between items-center mt-6">
          <p className="text-lg font-semibold">Number of Tasks: {numberOfTasks}</p>
          <button 
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
            onClick={handleShowAllTasks}
          >
            Show All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
