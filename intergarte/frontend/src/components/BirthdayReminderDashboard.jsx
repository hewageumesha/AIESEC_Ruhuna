// BirthdayReminderDashboard.jsx
import React from 'react';
import BirthdayForm from '../../../birthday reminder-frontend/src/components/BirthdayForm';
import BirthdayList from '../../../birthday reminder-frontend/src/components/BirthdayCard';

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
