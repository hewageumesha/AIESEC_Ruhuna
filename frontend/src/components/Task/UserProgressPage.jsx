import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

function UserProgressPage() {
    // State declarations
    const [progressData, setProgressData] = useState([]);
    const [chartType, setChartType] = useState("bar");
    const [search, setSearch] = useState("");
    const [expandedCard, setExpandedCard] = useState(null);

    // Fetch user progress data on component mount
    useEffect(() => {
        fetch("http://localhost:8080/api/user/progress")
            .then(res => res.json())
            .then(data => {
                const formattedData = Array.isArray(data) ? data : [data];
                formattedData.sort((a, b) => b.progressPercentage - a.progressPercentage);
                setProgressData(formattedData);
            })
            .catch(err => console.error("Error fetching progress data:", err));
    }, []);

    // Progress bar color logic
    const getProgressColor = (percentage) => {
        if (percentage >= 80) return "bg-green-500";
        if (percentage >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };

    // CSV Export
    const exportToCSV = () => {
        const csv = [
            ["Name", "Total Tasks", "Completed Tasks", "Progress (%)"],
            ...progressData.map(user => [
                user.name,
                user.totalTasks,
                user.completedTasks,
                user.progressPercentage.toFixed(1)
            ])
        ];
        const blob = new Blob([csv.map(row => row.join(",")).join("\n")], {
            type: "text/csv;charset=utf-8;"
        });
        saveAs(blob, "user_progress.csv");
    };

    // PDF Export
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("User Progress Report", 14, 10);
        autoTable(doc, {
            startY: 20,
            head: [["Name", "Total Tasks", "Completed Tasks", "Progress (%)"]],
            body: progressData.map(user => [
                user.name,
                user.totalTasks,
                user.completedTasks,
                user.progressPercentage.toFixed(1)
            ])
        });
        doc.save("user_progress.pdf");
    };

    // Search filter
    const filteredData = progressData.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Header Section */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">📊 User Progress Dashboard</h2>
                    <p className="text-gray-500 mt-1">Track and export your team's task completion progress.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportToCSV} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow">
                        Export CSV
                    </button>
                    <button onClick={exportToPDF} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow">
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Search & Chart Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            {/* User Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map(user => {
                    const goalReached = user.progressPercentage >= 80;
                    return (
                        <div key={user.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
                            <div className="text-sm text-gray-700 mb-1"><strong>Total Tasks:</strong> {user.totalTasks}</div>
                            <div className="text-sm text-gray-700 mb-1"><strong>Completed:</strong> {user.completedTasks}</div>

                            <div className="mb-1 relative">
                                <div className="w-full bg-gray-300 rounded-full h-4">
                                    <div
                                        className={`${getProgressColor(user.progressPercentage)} h-4 rounded-full text-xs text-center text-white`}
                                        style={{ width: `${user.progressPercentage}%` }}
                                    >
                                        {user.progressPercentage.toFixed(1)}%
                                    </div>
                                    <div className="absolute top-0 left-[80%] h-4 w-1 bg-black opacity-40" title="Target: 80%" />
                                </div>
                            </div>

                            <button
                                className="text-blue-500 mt-2 text-sm underline"
                                onClick={() => setExpandedCard(expandedCard === user.id ? null : user.id)}
                            >
                                {expandedCard === user.id ? "Hide Details" : "Show Task Breakdown"}
                            </button>

                            {expandedCard === user.id && (
                                <div className="mt-3 text-sm text-gray-600 space-y-1">
                                    <p><strong>Pending Tasks:</strong> {user.totalTasks - user.completedTasks}</p>
                                    <p><strong>Status:</strong> {goalReached ? "🎯 Goal Reached" : "⏳ In Progress"}</p>
                                    <p><strong>Progress:</strong> {goalReached ? "✅ Excellent!" : "Keep going 💪"}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>


        </div>
    );
}

export default UserProgressPage;
