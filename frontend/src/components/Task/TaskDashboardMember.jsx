import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskList from "./TaskList";
import AssignedTasks from "./AssignedTasks";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import UserProgressPage from "./UserProgressPage";

const TaskDashboardMember = () => {
    // 🔹 Extract userId from URL
    const { id} = useParams();

    // 🔹 States for user info
    const [username, setUsername] = useState("Krish");
    const [numberOfTasks, setNumberOfTasks] = useState(0);
    const navigate = useNavigate();

    // 🔹 Fetch user details from backend
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/id/${id}`);
                if (response.ok) {
                    const userDetails = await response.json();
                    setUsername(userDetails.userName);
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

    // 🔹 Navigation Handlers
    const handleShowAllTasks = () => {
        navigate(`/assigned-tasks`);
    };



    // 🔹 Component Return JSX
    return (
        <div className="w-full min-h-screen bg-gray-100 flex">

            {/* 🔸 Sidebar Navigation */}
            <div className="w-64 bg-blue-800 text-white p-6 space-y-6 min-h-screen">
                <h3 className="text-2xl font-bold mb-4">Welcome, {username}</h3>
                <ul className="space-y-4">
                    <li>
                        <button
                            onClick={() => navigate(`/dashboard`)}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleShowAllTasks}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-700"
                        >
                            My Tasks
                        </button>
                    </li>
                    <li>

                    </li>
                    <li>
                        <button
                            onClick={() => navigate(`/user/${id}/progress`)}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-700"
                        >
                            User Progress
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate(`/user/${id}/notifications`)}
                            className="w-full text-left px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Notifications
                        </button>
                    </li>
                </ul>
            </div>

            {/* 🔸 Main Content Area */}
            <div className="flex-1 p-10">
                <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">

                    {/* 🔹 Header with Create Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-blue-700">Task Management</h2>

                    </div>

                    {/* 🔹 Components – Task List and Assigned Tasks */}
                    <TaskList />
                    <UserProgressPage/>
                    <AssignedTasks />

                    {/* 🔹 Stats and Chart Section */}
                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Number of Tasks: {numberOfTasks}</p>
                            <button
                                className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
                                onClick={handleShowAllTasks}
                            >
                                Show All Tasks
                            </button>
                        </div>

                        {/* 🔹 Bar Chart – Task Status Overview */}
                        <BarChart width={500} height={300} data={[
                            { status: "Completed", count: 10 },
                            { status: "In Progress", count: 5 },
                            { status: "Not Started", count: 3 }
                        ]}>
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>

                        {/* 🔹 User Progress Section */}


                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDashboardMember;
