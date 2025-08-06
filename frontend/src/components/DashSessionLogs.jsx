
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FaCalendarAlt, FaSearch, FaUserCircle } from 'react-icons/fa';

export default function DashSessionLogs() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    fetchLogs();
  }, [currentUser, navigate]);

  const fetchLogs = async () => {
    try {
        const res = await axios.get(`https://aiesecinruhuna-production.up.railway.app/api/auth/sessions`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        setLogs(res.data); // set to state
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch session logs');
    }
  };

  useEffect(() => {
    let filtered = logs.filter(log =>
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const now = moment();
    filtered = filtered.filter(log => {
      const logDate = moment(log.timestamp);
      switch (dateFilter) {
        case 'today':
          return logDate.isSame(now, 'day');
        case 'thisWeek':
          return logDate.isAfter(moment().subtract(7, 'days'));
        case 'thisMonth':
          return logDate.isAfter(moment().subtract(30, 'days'));
        case 'custom':
          if (!customStartDate || !customEndDate) return true;
          const start = moment(customStartDate);
          const end = moment(customEndDate).endOf('day');
          return logDate.isBetween(start, end, null, '[]');
        default:
          return true;
      }
    });

    setFilteredLogs(filtered);
  }, [logs, searchTerm, dateFilter, customStartDate, customEndDate]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Session Logs</h1>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or AIESEC email"
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

        {dateFilter === 'custom' && (
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3">User</th>
              <th className="p-3">AIESEC Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Login Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
                <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500 dark:text-gray-300">
                    No session logs found for the selected filter.
                </td>
                </tr>
            ) : (
                filteredLogs.map((log) => (
                <tr key={log.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">
                    {/* Just display userEmail since no user details available */}
                    {log.userEmail}
                    </td>
                    <td className="p-3">{log.userEmail}</td> {/* same as above */}
                    <td className="p-3">{log.role}</td> {/* same as above */}
                    <td className="p-3">{log.status.toLowerCase()}</td> {/* status as "role" replacement */}
                    <td className="p-3">{moment(log.loginTime).format('MMM D, YYYY [at] h:mm A')}</td>
                </tr>
                ))
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
