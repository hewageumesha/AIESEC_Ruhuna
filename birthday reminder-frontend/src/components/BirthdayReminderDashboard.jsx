// BirthdayReminderDashboard.js
import React from 'react';
import BirthdayForm from './BirthdayForm';
import BirthdayList from './BirthdayCard';

export default function BirthdayReminderDashboard() {
  return (
    <div>
      <h1>Birthday Reminder Dashboard</h1>
      <BirthdayForm />
      <BirthdayList />
      {/* add other parts */}
    </div>
  );
}
