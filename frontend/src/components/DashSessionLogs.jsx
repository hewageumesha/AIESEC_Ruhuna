import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { FaSearch } from "react-icons/fa";

export default function DashSessionLogs() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [letterFilter, setLetterFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    fetchLogs();
  }, [currentUser, navigate]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/auth/sessions`,
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );

      // Auto-remove logs older than 2 months
      const twoMonthsAgo = moment().subtract(2, "months");
      const recentLogs = res.data.filter((log) =>
        moment(log.loginTime).isAfter(twoMonthsAgo)
      );

      setLogs(recentLogs);

      // OPTIONAL: delete from backend too
      const oldLogs = res.data.filter((log) =>
        moment(log.loginTime).isBefore(twoMonthsAgo)
      );
      if (oldLogs.length > 0) {
        for (const old of oldLogs) {
          await axios.delete(
            `http://localhost:8080/api/auth/sessions/${old.id}`,
            { headers: { Authorization: `Bearer ${currentUser.token}` } }
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch session logs");
    }
  };

  useEffect(() => {
    let filtered = [...logs];

    // Role-based access
    if (currentUser.role === "LCVP") {
      filtered = filtered.filter((log) => {
        // Only show Team Leaders and Members from the same function
        return (
          (log.role === "Team_Leader" || log.role === "Member") &&
          log.function?.id === currentUser.function?.id
        );
      });
      console.log( currentUser.function?.id);
    } else if (currentUser.role === "Team_Leader" || currentUser.role === "Member") {
      filtered = filtered.filter((log) => log.userEmail === currentUser.email);
    }

    // Search filter
    filtered = filtered.filter((log) =>
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Alphabet filter
    if (letterFilter !== "All") {
      filtered = filtered.filter((log) =>
        log.userEmail[0]?.toUpperCase() === letterFilter
      );
    }

    // Date filter
    const now = moment();
    filtered = filtered.filter((log) => {
      const logDate = moment(log.loginTime);
      switch (dateFilter) {
        case "today":
          return logDate.isSame(now, "day");
        case "thisWeek":
          return logDate.isAfter(moment().subtract(7, "days"));
        case "thisMonth":
          return logDate.isAfter(moment().subtract(30, "days"));
        case "custom":
          if (!customStartDate || !customEndDate) return true;
          const start = moment(customStartDate);
          const end = moment(customEndDate).endOf("day");
          return logDate.isBetween(start, end, null, "[]");
        default:
          return true;
      }
    });

    setFilteredLogs(filtered);
  }, [logs, searchTerm, letterFilter, dateFilter, customStartDate, customEndDate, currentUser]);

  // pagination
  const startIndex = (page - 1) * perPage;
  const paginated = filteredLogs.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(filteredLogs.length / perPage);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Session Logs</h1>

      {/* Search + Date filter */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by AIESEC email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-1 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded-lg px-3 py-1 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateFilter === "custom" && (
          <>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </>
        )}
      </div>

      {/* Alphabet filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((char) => (
          <button
            key={char}
            onClick={() => {
              setLetterFilter(char);
              setPage(1);
            }}
            className={`px-2 py-1 rounded ${
              letterFilter === char ? "bg-teal-700 text-white" : "bg-gray-200"
            }`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3">User Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Login Time</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-4 text-gray-500 dark:text-gray-300"
                >
                  No session logs found.
                </td>
              </tr>
            ) : (
              paginated.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-3">{log.userEmail}</td>
                  <td className="p-3">{log.role}</td>
                  <td className="p-3">{log.status.toLowerCase()}</td>
                  <td className="p-3">
                    {moment(log.loginTime).format("MMM D, YYYY [at] h:mm A")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-teal-700 text-white" : "bg-gray-200 dark:text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}