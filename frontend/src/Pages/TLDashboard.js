/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import TaskOverview from "./../Components/TaskOverview"

function TLDashboard() {
    const bgStyle = { backgroundColor: "#F3F4F6" };
    return (
        <div class="flex min-h-screen" style={bgStyle}>
            <div class="w-64 bg-white shadow-md">
                <div class="p-4">
                    <h1 class="text-2xl font-bold text-gray-800">
                        TL Dashboard
                    </h1>
                </div>
                <nav class="mt-6">
                    <a class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200" href="#">
                        <i class="fas fa-home mr-2">
                        </i>
                        Home
                    </a>
                    <a class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200" href="#">
                        <i class="fas fa-tasks mr-2">
                        </i>
                        Task Management
                    </a>
                    <a class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200" href="#">
                        <i class="fas fa-users mr-2">
                        </i>
                        User Management
                    </a>

                </nav>
            </div>
            <div class="flex-1 p-6">
                <div class="bg-white p-6 rounded-lg shadow-md mb-6 flex items-center">
                    <img alt="Profile of the Local Committee President" class="w-24 h-24 rounded-full mr-4"
                        height="100"
                        src="https://storage.googleapis.com/a1aa/image/LpbuasrNHH9lLqRb-C0LSHCBuCXJMgiF5t-osPuCCPY.jpg"
                        width="100" />
                    <div>
                        <h2 class="text-xl font-bold">
                            Team Leader
                        </h2>
                        <p class="text-gray-600">
                            John Doe
                        </p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 class="text-xl font-bold mb-4">
                        Task Assignment Panel
                    </h2>
                    <div class="flex space-x-4">
                        <a class="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                            href="TaskManagementTL.html">
                            Assign to Members
                        </a>
                    </div>
                </div>
                <TaskOverview />
            </div>
        </div>
    );
}

export default TLDashboard;
