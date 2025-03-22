/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

function MemberDashboard() {
    const bgStyle = { backgroundColor: "#F3F4F6" };
    return (
        <div>
            <header class="bg-blue-600 text-white p-4 flex justify-between items-center">
                <div class="flex items-center">
                    <img alt="Profile of the member" class="rounded-full mr-4" height="50"
                        src="https://storage.googleapis.com/a1aa/image/dmNLibox59A_GOb_LijlBrEA7FewTamjZZ4NxOvXW4U.jpg"
                        width="50" />
                    <div>
                        <h1 class="text-xl font-bold">
                            John Doe
                        </h1>
                        <p>
                            Assigned Function: Marketing
                        </p>
                    </div>
                </div>
            </header>

            <div class="flex" style={bgStyle}>
                <nav class="bg-white w-64 p-4 shadow-lg">
                    <ul>
                        <li class="mb-4">
                            <a class="text-blue-600 font-bold" href="#">
                                <i class="fas fa-home mr-2">
                                </i>
                                Home
                            </a>
                        </li>
                        <li class="mb-4">
                            <a class="text-gray-700" href="#">
                                <i class="fas fa-tasks mr-2">
                                </i>
                                My Tasks
                            </a>
                        </li>
                        <li class="mb-4">
                            <a class="text-gray-700" href="#">
                                <i class="fas fa-bullhorn mr-2">
                                </i>
                                Announcements
                            </a>
                        </li>
                    </ul>
                </nav>
                <main class="flex-1 p-6">
                    <section class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">
                            Task Overview
                        </h2>
                        <div class="mb-4">
                            <label class="block text-gray-700" for="filter">
                                Filter by:
                            </label>
                            <select class="mt-1 block w-full p-2 border border-gray-300 rounded-md" id="filter">
                                <option>
                                    Deadline
                                </option>
                                <option>
                                    Priority
                                </option>
                                <option>
                                    Status
                                </option>
                            </select>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-md">
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <h3 class="text-lg font-bold">
                                        Task 1
                                    </h3>
                                    <p>
                                        Assigned by: Team Leader
                                    </p>
                                </div>
                                <div>
                                    <select class="p-2 border border-gray-300 rounded-md">
                                        <option>
                                            Not Started
                                        </option>
                                        <option>
                                            In Progress
                                        </option>
                                        <option>
                                            Completed
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <h3 class="text-lg font-bold">
                                        Task 2
                                    </h3>
                                    <p>
                                        Assigned by: LCVP
                                    </p>
                                </div>
                                <div>
                                    <select class="p-2 border border-gray-300 rounded-md">
                                        <option>
                                            Not Started
                                        </option>
                                        <option>
                                            In Progress
                                        </option>
                                        <option>
                                            Completed
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <h3 class="text-lg font-bold">
                                        Task 3
                                    </h3>
                                    <p>
                                        Assigned by: LCP
                                    </p>
                                </div>
                                <div>
                                    <select class="p-2 border border-gray-300 rounded-md">
                                        <option>
                                            Not Started
                                        </option>
                                        <option>
                                            In Progress
                                        </option>
                                        <option>
                                            Completed
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">
                            Announcements
                        </h2>
                        <div class="bg-white p-4 rounded-lg shadow-md">
                            <div class="mb-4">
                                <h3 class="text-lg font-bold text-red-600">
                                    New Announcement 1
                                </h3>
                                <p>
                                    Important update regarding the upcoming event.
                                </p>
                            </div>
                            <div class="mb-4">
                                <h3 class="text-lg font-bold">
                                    Announcement 2
                                </h3>
                                <p>
                                    Meeting notice for all team members.
                                </p>
                            </div>
                            <div class="mb-4">
                                <h3 class="text-lg font-bold">
                                    Announcement 3
                                </h3>
                                <p>
                                    Organizational news and updates.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 class="text-2xl font-bold mb-4">
                            Notifications
                        </h2>
                        <div class="bg-white p-4 rounded-lg shadow-md">
                            <div class="mb-4">
                                <h3 class="text-lg font-bold">
                                    Task Deadline
                                </h3>
                                <p>
                                    Task 1 is due tomorrow.
                                </p>
                            </div>
                            <div class="mb-4">
                                <h3 class="text-lg font-bold">
                                    Event Reminder
                                </h3>
                                <p>
                                    Event 2 is happening in 3 days.
                                </p>
                            </div>
                            <div class="mb-4">
                                <h3 class="text-lg font-bold">
                                    New Announcement
                                </h3>
                                <p>
                                    Check the latest announcement for important updates.
                                </p>
                            </div>
                            <div class="mb-4">
                                <h3 class="text-lg font-bold">
                                    Financial Update
                                </h3>
                                <p>
                                    Your financial report for this month is available.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

        </div>
    );
}

export default MemberDashboard;
