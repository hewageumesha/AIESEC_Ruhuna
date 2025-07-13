import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, CalendarX } from 'lucide-react';

const getDaysRemaining = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    const diff = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diff >= 0
        ? `${diff} day${diff === 1 ? '' : 's'} left`
        : `Overdue by ${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'}`;
};

const Notifications = ({ id }) => {
    const [alerts, setAlerts] = useState([]);
    const [overdue, setOverdue] = useState([]);

    useEffect(() => {
        console.log("👀 Notifications received id:", id);
        if (!id || id.trim() === '') return;

        const fetchTasks = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/user/${id}/notification`);
                const data = await res.json();

                const today = new Date();
                const upcoming = [];
                const overdueTasks = [];

                data.forEach((task) => {
                    const deadline = new Date(task.deadLine);
                    const diff = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
                    if (task.workOfStatus.toLowerCase() !== 'completed') {
                        if (diff < 0) overdueTasks.push(task);
                        else if (diff <= 7) upcoming.push(task);
                    }
                });

                setAlerts(upcoming);
                setOverdue(overdueTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [id]);

    return (
        <div className="min-h-screen w-full bg-white px-8 py-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="text-blue-600" /> Notifications
            </h2>

            {/* Upcoming Tasks */}
            <section className="mb-10">
                <h3 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-yellow-600" /> Upcoming Deadlines
                </h3>
                {alerts.length === 0 ? (
                    <p className="text-gray-500 italic">No upcoming deadlines.</p>
                ) : (
                    <ul className="space-y-4">
                        {alerts.map((task) => (
                            <li
                                key={task.taskId}
                                className="flex items-center justify-between p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 transition hover:scale-[1.01] hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-yellow-600 w-5 h-5" />
                                    <span className="font-medium text-yellow-900">{task.taskName}</span>
                                </div>
                                <span className="text-yellow-700 font-semibold">{getDaysRemaining(task.deadLine)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Overdue Tasks */}
            <section>
                <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
                    <CalendarX className="text-red-600" /> Overdue Tasks
                </h3>
                {overdue.length === 0 ? (
                    <p className="text-gray-500 italic">No overdue tasks.</p>
                ) : (
                    <ul className="space-y-4">
                        {overdue.map((task) => (
                            <li
                                key={task.taskId}
                                className="flex items-center justify-between p-4 rounded-lg border-l-4 border-red-600 bg-red-50 transition hover:scale-[1.01] hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <CalendarX className="text-red-600 w-5 h-5" />
                                    <span className="font-medium text-red-900">{task.taskName}</span>
                                </div>
                                <span className="text-red-700 font-semibold">{getDaysRemaining(task.deadLine)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default Notifications;
