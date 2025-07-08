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

    // Filters state
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedFunction, setSelectedFunction] = useState("");
    const [selectedRole, setSelectedRole] = useState(""); // NEW role filter

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

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

    // Extract unique values for filters
    const uniqueDepartments = Array.from(
        new Set(progressData.map((u) => u.department?.name).filter(Boolean))
    );
    const uniqueFunctions = Array.from(
        new Set(progressData.map((u) => u.function?.name).filter(Boolean))
    );
    const uniqueRoles = Array.from(
        new Set(progressData.map((u) => u.role).filter(Boolean))
    );

    const exportToCSV = () => {
        const csv = [
            [
                "Name",
                "Email",
                "Department",
                "Function",
                "Role",
                "Total Tasks",
                "Completed Tasks",
                "Progress (%)",
            ],
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
        doc.setTextColor("#0052cc");
        doc.setFontSize(16);
        doc.text("User Progress Report", 14, 10);
        autoTable(doc, {
            startY: 20,
            headStyles: {
                fillColor: "#0052cc",
                textColor: "#ffffff",
            },
            head: [[
                "Name",
                "Email",
                "Department",
                "Function",
                "Role",
                "Total Tasks",
                "Completed Tasks",
                "Progress (%)",
            ]],
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

    // Filter based on search, department, function, role
    const filteredData = progressData.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(search.toLowerCase()));
        const matchesDepartment = selectedDepartment
            ? user.department?.name === selectedDepartment
            : true;
        const matchesFunction = selectedFunction
            ? user.function?.name === selectedFunction
            : true;
        const matchesRole = selectedRole
            ? user.role === selectedRole
            : true;
        return matchesSearch && matchesDepartment && matchesFunction && matchesRole;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedDepartment, selectedFunction, selectedRole]);

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return "#0052cc";
        if (percentage >= 40) return "#6699ff";
        return "#b3c7ff";
    };

    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 240;
        return `hsl(${hue}, 70%, 60%)`;
    };

    return (
        <div
            style={{
                maxWidth: 900,
                margin: "2rem auto",
                padding: "1rem",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                backgroundColor: "#e6f0ff",
                minHeight: "100vh",
                color: "#222222",
            }}
        >
            <header
                style={{
                    marginBottom: "2rem",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    color: "#0052cc",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "2rem",
                            fontWeight: "700",
                            marginBottom: 4,
                            userSelect: "none",
                        }}
                    >
                        User Progress Dashboard
                    </h1>
                    <p style={{ color: "#0041a3", fontWeight: "600" }}>
                        Track and export your team's task completion progress.
                    </p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                        onClick={exportToCSV}
                        style={{
                            backgroundColor: "#0052cc",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: 6,
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                            fontWeight: "600",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0041a3")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0052cc")}
                        aria-label="Export progress data as CSV"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={exportToPDF}
                        style={{
                            backgroundColor: "#ffcd00",
                            color: "#222222",
                            border: "none",
                            borderRadius: 6,
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                            fontWeight: "600",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d4b800")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffcd00")}
                        aria-label="Export progress data as PDF"
                    >
                        Export PDF
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                    maxWidth: 900,
                    color: "#222222",
                }}
            >
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "0.5rem 0.75rem",
                        borderRadius: 6,
                        border: "1px solid #0052cc",
                        fontSize: "1rem",
                        minWidth: 180,
                        color: "#222222",
                        outlineColor: "#0052cc",
                    }}
                    aria-label="Search users by name or email"
                />

                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    style={{
                        padding: "0.5rem",
                        borderRadius: 6,
                        border: "1px solid #0052cc",
                        fontSize: "1rem",
                        minWidth: 150,
                        color: "#222222",
                        outlineColor: "#0052cc",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                    }}
                    aria-label="Filter by Department"
                >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedFunction}
                    onChange={(e) => setSelectedFunction(e.target.value)}
                    style={{
                        padding: "0.5rem",
                        borderRadius: 6,
                        border: "1px solid #0052cc",
                        fontSize: "1rem",
                        minWidth: 150,
                        color: "#222222",
                        outlineColor: "#0052cc",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                    }}
                    aria-label="Filter by Function"
                >
                    <option value="">All Functions</option>
                    {uniqueFunctions.map((func) => (
                        <option key={func} value={func}>
                            {func}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{
                        padding: "0.5rem",
                        borderRadius: 6,
                        border: "1px solid #0052cc",
                        fontSize: "1rem",
                        minWidth: 150,
                        color: "#222222",
                        outlineColor: "#0052cc",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                    }}
                    aria-label="Filter by Role"
                >
                    <option value="">All Roles</option>
                    {uniqueRoles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <p style={{ textAlign: "center", color: "#0041a3" }}>
                    Loading user progress...
                </p>
            )}
            {error && (
                <p style={{ color: "#b30000", textAlign: "center" }}>{error}</p>
            )}
            {!loading && !error && filteredData.length === 0 && (
                <p style={{ textAlign: "center", color: "#6699ff" }}>
                    No matching progress data found.
                </p>
            )}

            {!loading && !error && currentData.length > 0 && (
                <>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "1.5rem",
                        }}
                    >
                        {currentData.map((user) => {
                            const goalReached = user.progressPercentage >= 80;
                            return (
                                <div
                                    key={user.id}
                                    style={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: 12,
                                        boxShadow: "0 4px 12px rgba(0, 82, 204, 0.15)", // subtle blue shadow
                                        padding: "1.25rem",
                                        transition: "transform 0.3s",
                                        cursor: "default",
                                        border: `1.5px solid ${
                                            goalReached ? "#0052cc" : "#c7d9ff"
                                        }`,
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform = "scale(1.03)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform = "scale(1)")
                                    }
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {user.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt={`${user.name}'s profile`}
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "2px solid #0052cc",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                aria-label={`${user.name} profile initials`}
                                                title={`${user.name} profile initials`}
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: "50%",
                                                    backgroundColor: stringToColor(user.name),
                                                    color: "white",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontWeight: "700",
                                                    fontSize: "1rem",
                                                    lineHeight: "48px",
                                                    textAlign: "center",
                                                    border: "2px solid #0052cc",
                                                    userSelect: "none",
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {getInitials(user.name)}
                                            </div>
                                        )}

                                        <div>
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    fontWeight: "600",
                                                    fontSize: "1.25rem",
                                                    color: "#0052cc",
                                                    userSelect: "text",
                                                }}
                                            >
                                                {user.name}
                                            </h3>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "0.9rem",
                                                    color: "#222222",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {user.role || "Role unknown"} —{" "}
                                                <span style={{ color: "#0052cc" }}>
                          {user.department?.name || "No department"}
                        </span>
                                                <br />
                                                <span
                                                    style={{
                                                        margin: "0.1rem 0 0 0",
                                                        fontSize: "0.8rem",
                                                        color: "#7f8c8d",
                                                        lineHeight: "1.1rem",
                                                        fontWeight: "400",
                                                        userSelect: "text",
                                                    }}
                                                >
                          {user.function?.name || "No function"}
                        </span>
                                            </p>
                                        </div>
                                    </div>

                                    <p style={{ margin: "0.25rem 0", color: "#222222" }}>
                                        <strong>Total Tasks:</strong> {user.totalTasks}
                                    </p>
                                    <p style={{ margin: "0.25rem 0", color: "#222222" }}>
                                        <strong>Completed:</strong> {user.completedTasks}
                                    </p>

                                    <div
                                        style={{
                                            marginTop: 12,
                                            height: 20,
                                            width: "100%",
                                            backgroundColor: "#c7d9ff", // very light blue background bar
                                            borderRadius: 10,
                                            overflow: "hidden",
                                            position: "relative",
                                        }}
                                        title={`${user.progressPercentage.toFixed(1)}%`}
                                    >
                                        <div
                                            style={{
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
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {user.progressPercentage.toFixed(1)}%
                                        </div>
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: "80%",
                                                height: "100%",
                                                width: 2,
                                                backgroundColor: "rgba(0, 82, 204, 0.5)", // semi-transparent blue
                                            }}
                                            title="Target: 80%"
                                        />
                                    </div>

                                    <button
                                        onClick={() =>
                                            setExpandedCard(expandedCard === user.id ? null : user.id)
                                        }
                                        style={{
                                            marginTop: 12,
                                            background: "none",
                                            border: "none",
                                            color: "#0052cc",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            fontSize: "0.9rem",
                                            padding: 0,
                                            fontWeight: "600",
                                            userSelect: "text",
                                        }}
                                        aria-expanded={expandedCard === user.id}
                                        aria-controls={`task-breakdown-${user.id}`}
                                        aria-label={
                                            expandedCard === user.id
                                                ? `Hide task breakdown for ${user.name}`
                                                : `Show task breakdown for ${user.name}`
                                        }
                                    >
                                        {expandedCard === user.id
                                            ? "Hide Task Breakdown"
                                            : "Show Task Breakdown"}
                                    </button>

                                    {expandedCard === user.id && (
                                        <div
                                            id={`task-breakdown-${user.id}`}
                                            style={{
                                                marginTop: 10,
                                                fontSize: "0.9rem",
                                                color: "#222222",
                                                lineHeight: 1.4,
                                                fontWeight: "500",
                                            }}
                                        >
                                            <p>
                                                <strong>Pending Tasks:</strong>{" "}
                                                {user.totalTasks - user.completedTasks}
                                            </p>
                                            <p>
                                                <strong>Status:</strong>{" "}
                                                {goalReached ? "🎯 Goal Reached" : "⏳ In Progress"}
                                            </p>
                                            <p>
                                                <strong>Progress:</strong> {user.progressPercentage.toFixed(1)}%
                                            </p>
                                            {/* Add more detailed info if available */}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div
                        style={{
                            marginTop: "2rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            style={{
                                backgroundColor: currentPage === 1 ? "#c7d9ff" : "#0052cc",
                                color: currentPage === 1 ? "#7f8c8d" : "#ffffff",
                                border: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: 6,
                                cursor: currentPage === 1 ? "default" : "pointer",
                                fontWeight: "600",
                                boxShadow:
                                    currentPage === 1 ? "none" : "0 2px 6px rgba(0,0,0,0.15)",
                                transition: "background-color 0.3s",
                            }}
                            aria-label="Previous page"
                            onMouseEnter={(e) => {
                                if (currentPage !== 1) e.currentTarget.style.backgroundColor = "#0041a3";
                            }}
                            onMouseLeave={(e) => {
                                if (currentPage !== 1) e.currentTarget.style.backgroundColor = "#0052cc";
                            }}
                        >
                            Prev
                        </button>
                        <span style={{ fontWeight: "600", color: "#0052cc" }}>
              Page {currentPage} of {totalPages}
            </span>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            style={{
                                backgroundColor: currentPage === totalPages ? "#c7d9ff" : "#0052cc",
                                color: currentPage === totalPages ? "#7f8c8d" : "#ffffff",
                                border: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: 6,
                                cursor: currentPage === totalPages ? "default" : "pointer",
                                fontWeight: "600",
                                boxShadow:
                                    currentPage === totalPages ? "none" : "0 2px 6px rgba(0,0,0,0.15)",
                                transition: "background-color 0.3s",
                            }}
                            aria-label="Next page"
                            onMouseEnter={(e) => {
                                if (currentPage !== totalPages)
                                    e.currentTarget.style.backgroundColor = "#0041a3";
                            }}
                            onMouseLeave={(e) => {
                                if (currentPage !== totalPages)
                                    e.currentTarget.style.backgroundColor = "#0052cc";
                            }}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProgressPage;
