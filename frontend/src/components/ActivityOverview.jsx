import React, { useState } from "react";

function ActivityOverview() {
    return (
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">
                Recent Activities &amp; Notifications
            </h2>
            <ul>
                <li class="flex items-center justify-between py-2 border-b">
                    <span>
                        Task "Design Homepage" completed by Jane Smith
                    </span>
                    <span class="text-gray-500 text-sm">
                        2 hours ago
                    </span>
                </li>
                <li class="flex items-center justify-between py-2 border-b">
                    <span>
                        New task "Develop API" assigned to Bob Johnson
                    </span>
                    <span class="text-gray-500 text-sm">
                        5 hours ago
                    </span>
                </li>
                <li class="flex items-center justify-between py-2 border-b">
                    <span>
                        Upcoming deadline for "Marketing Plan" in 3 days
                    </span>
                    <span class="text-gray-500 text-sm">
                        1 day ago
                    </span>
                </li>
            </ul>
        </div>
    );
}

export default ActivityOverview;