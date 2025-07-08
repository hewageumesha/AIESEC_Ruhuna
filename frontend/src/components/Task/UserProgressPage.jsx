import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const UserProgressPage = () => {
    const [progressData, setProgressData] = useState([]);
    const [search, setSearch] = useState("");
    const [expandedCard, setExpandedCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    useEffect(() => {
        if (userId) {
            fetchProgressData();
        } else {
            setLoading(false);
            setError("No logged-in user found.");
        }
    }, [userId]);

    const fetchProgressData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/user/progress?userId=${userId}`
            );
            const data = Array.isArray(response.data)
                ? response.data
                : [response.data];
            data.sort((a, b) => b.progressPercentage - a.progressPercentage);
            setProgressData(data);
        } catch (err) {
            console.error("Error fetching progress data:", err);
            setError("Failed to fetch progress data.");
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const csv = [
            ["Name", "Email", "Department", "Function", "Role", "Total Tasks", "Completed Tasks", "Progress (%)"],
            ...progressData.map((user) => [
                user.name,
                user.email || "",
                user.department?.name || "",
                user.function?.name || "",
                user.role || "",
                user.totalTasks,
                user.completedTasks,
                user.progressPercentage.toFixed(1),
            ]),
        ];
        const blob = new Blob([csv.map((row) => row.join(",")).join("\n")], {
            type: "text/csv;charset=utf-8;",
        });
        saveAs(blob, "user_progress.csv");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("User Progress Report", 14, 10);
        autoTable(doc, {
            startY: 20,
            head: [["Name", "Email", "Department", "Function", "Role", "Total Tasks", "Completed Tasks", "Progress (%)"]],
            body: progressData.map((user) => [
                user.name,
                user.email || "",
                user.department?.name || "",
                user.function?.name || "",
                user.role || "",
                user.totalTasks,
                user.completedTasks,
                user.progressPercentage.toFixed(1),
            ]),
        });
        doc.save("user_progress.pdf");
    };

    const filteredData = progressData.filter(
        (user) =>
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
    );

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return "#27ae60";
        if (percentage >= 40) return "#f39c12";
        return "#c0392b";
    };

    return (
        <div style={{
            maxWidth: 900,
            margin: "2rem auto",
            padding: "1rem",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: "#f7fafc",
            minHeight: "100vh"
        }}>
            <header style={{
                marginBottom: "2rem",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem"
            }}>
                <div>
                    <h1 style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#2c3e50",
                        marginBottom: 4
                    }}>
                        📊 User Progress Dashboard
                    </h1>
                    <p style={{ color: "#7f8c8d" }}>
                        Track and export your team's task completion progress.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button onClick={exportToCSV} style={{
                        backgroundColor: "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontWeight: "600",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                    }}>
                        Export CSV
                    </button>
                    <button onClick={exportToPDF} style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontWeight: "600",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                    }}>
                        Export PDF
                    </button>
                </div>
            </header>

            <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    maxWidth: 400,
                    padding: "0.5rem 0.75rem",
                    marginBottom: "2rem",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                }}
            />

            {loading && <p style={{ textAlign: "center", color: "#7f8c8d" }}>Loading user progress...</p>}
            {error && <p style={{ color: "#e74c3c", textAlign: "center" }}>{error}</p>}
            {!loading && !error && filteredData.length === 0 && (
                <p style={{ textAlign: "center", color: "#95a5a6" }}>No matching progress data found.</p>
            )}

            {!loading && !error && filteredData.length > 0 && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {filteredData.map(user => {
                        const goalReached = user.progressPercentage >= 80;
                        return (
                            <div key={user.id} style={{
                                backgroundColor: "white",
                                borderRadius: 12,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                padding: "1.25rem",
                                transition: "transform 0.3s",
                                cursor: "default"
                            }}
                                 onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                                 onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                    <img
                                        src={user.profilePicture || "https://via.placeholder.com/48?text=No+Image"}
                                        alt={`${user.name}'s profile`}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "2px solid #3498db"
                                        }}
                                    />
                                    <div>
                                        <h3 style={{
                                            margin: 0,
                                            fontWeight: "600",
                                            fontSize: "1.25rem",
                                            color: "#34495e"
                                        }}>{user.name}</h3>
                                        <p style={{
                                            margin: 0,
                                            fontSize: "0.9rem",
                                            color: "#7f8c8d"
                                        }}>
                                            <strong>{user.role || "Role unknown"}</strong> — {user.department?.name || "No department"}<br/>
                                            <span style={{ fontSize: "0.8rem", color: "#95a5a6" }}>
                                                {user.function?.name || "No function"}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <p style={{ margin: "0.25rem 0", color: "#7f8c8d" }}>
                                    <strong>Total Tasks:</strong> {user.totalTasks}
                                </p>
                                <p style={{ margin: "0.25rem 0", color: "#7f8c8d" }}>
                                    <strong>Completed:</strong> {user.completedTasks}
                                </p>

                                <div style={{
                                    marginTop: 12,
                                    height: 20,
                                    width: "100%",
                                    backgroundColor: "#ecf0f1",
                                    borderRadius: 10,
                                    overflow: "hidden",
                                    position: "relative"
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: `${user.progressPercentage}%`,
                                        backgroundColor: getProgressColor(user.progressPercentage),
                                        transition: "width 0.6s ease",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: "0.9rem",
                                        borderRadius: 10,
                                        whiteSpace: "nowrap"
                                    }}>
                                        {user.progressPercentage.toFixed(1)}%
                                    </div>
                                    <div style={{
                                        position: "absolute",
                                        top: 0,
                                        left: "80%",
                                        height: "100%",
                                        width: 2,
                                        backgroundColor: "rgba(0,0,0,0.3)"
                                    }} title="Target: 80%"></div>
                                </div>

                                <button onClick={() => setExpandedCard(expandedCard === user.id ? null : user.id)}
                                        style={{
                                            marginTop: 12,
                                            background: "none",
                                            border: "none",
                                            color: "#2980b9",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            fontSize: "0.9rem",
                                            padding: 0
                                        }}
                                        aria-expanded={expandedCard === user.id}
                                        aria-controls={`task-breakdown-${user.id}`}>
                                    {expandedCard === user.id ? "Hide Task Breakdown" : "Show Task Breakdown"}
                                </button>

                                {expandedCard === user.id && (
                                    <div id={`task-breakdown-${user.id}`} style={{
                                        marginTop: 10,
                                        fontSize: "0.9rem",
                                        color: "#555",
                                        lineHeight: 1.4
                                    }}>
                                        <p><strong>Pending Tasks:</strong> {user.totalTasks - user.completedTasks}</p>
                                        <p><strong>Status:</strong> {goalReached ? "🎯 Goal Reached" : "⏳ In Progress"}</p>
                                        <p><strong>Progress:</strong> {goalReached ? "✅ Excellent!" : "Keep going 💪"}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserProgressPage;
