import React, { useState } from "react";

function TaskOverview() {
    return (
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-bold mb-4">
                Task Overview
            </h2>
            <div class="flex space-x-4 mb-4">
                <div class="bg-blue-100 p-4 rounded-lg flex-1">
                    <h3 class="text-lg font-semibold">
                        Assigned Tasks
                    </h3>
                    <p class="text-2xl font-bold">
                        45
                    </p>
                </div>
                <div class="bg-green-100 p-4 rounded-lg flex-1">
                    <h3 class="text-lg font-semibold">
                        Completed Tasks
                    </h3>
                    <p class="text-2xl font-bold">
                        30
                    </p>
                </div>
                <div class="bg-red-100 p-4 rounded-lg flex-1">
                    <h3 class="text-lg font-semibold">
                        Pending Tasks
                    </h3>
                    <p class="text-2xl font-bold">
                        15
                    </p>
                </div>
            </div>
            <div class="flex space-x-4">
                <input class="flex-1 p-2 border rounded" placeholder="Search tasks..." type="text" />
                <select class="p-2 border rounded">
                    <option>
                        All
                    </option>
                    <option>
                        Assigned
                    </option>
                    <option>
                        Completed
                    </option>
                    <option>
                        Pending
                    </option>
                </select>
            </div>
        </div>
    );
}

export default TaskOverview;