import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UserProgressPage from "./UserProgressPage";
import TaskList from "./TaskList";


const TaskDashboard = () => {
    const { id } = useParams();
    const [firstName, setFirstName] = useState("Krish");
    const [numberOfTasks, setNumberOfTasks] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://aiesecruhuna-production.up.railway.app/api/users/id/${id}`);
                if (response.ok) {
                    const userDetails = await response.json();
                    setFirstName(userDetails.firstName);
                    setNumberOfTasks(userDetails.noOfTask);
                } else {
                    throw new Error("Failed to fetch user details");
                }
            } catch (error) {
                console.error("Error fetching user details:", error.message);
            }
        };

        fetchUserDetails();
    }, [id]);

    const handleShowAllTasks = () => navigate(`/assigned-tasks`);
    const handleCreateTask = () => navigate(`/user/${id}/CreateTask`);

    return (
        <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 flex transition-colors duration-300">

            {/* Sidebar Navigation */}
            <div className="w-64 bg-blue-800 dark:bg-gray-800 text-white p-6 space-y-6 min-h-screen transition-colors duration-300">
                <h3 className="text-2xl font-bold mb-4">Welcome, {firstName}</h3>
                <ul className="space-y-4">
                    <li>
                        <button
                            onClick={() => navigate(`/dashboard`)}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleShowAllTasks}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            My Tasks
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleCreateTask}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            Create Task
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate(`/user/${id}/progress`)}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            User Progress
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-10 transition-colors duration-300">
                <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400">Task Management</h2>
                        <button
                            className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-200"
                            onClick={handleCreateTask}
                        >
                            <span className="mr-2">+</span> Create Task
                        </button>
                    </div>

                    {/* Components */}
                    <TaskList/>
                    <UserProgressPage />
                </div>
            </div>
        </div>
    );
};

export default TaskDashboard;
