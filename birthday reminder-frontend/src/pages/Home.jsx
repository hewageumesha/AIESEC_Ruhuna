import React, { useEffect, useState } from 'react';
import BirthdayCard from '../components/BirthdayCard';
import { getDaysUntilBirthday } from '../utils/dateUtils';

const Home = ({ setTodayCount }) => {
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/birthdays')
      .then((response) => response.json())
      .then((data) => {
        setBirthdays(data);

        // Update count of today's birthdays
        const count = data.filter((b) => getDaysUntilBirthday(b.date) === 0).length;
        setTodayCount(count);
      })
      .catch((error) => console.error('Error fetching birthdays:', error));
  }, [setTodayCount]);


  const today = new Date();

  const upcomingBirthdays = birthdays.filter((b) => {
    const [year, month, day] = b.date.split('-').map(Number);
    const birthdayThisYear = new Date(today.getFullYear(), month - 1, day);
    return birthdayThisYear >= today;
  });

  const sortedUpcoming = [...upcomingBirthdays].sort((a, b) => {
    const [aY, aM, aD] = a.date.split('-').map(Number);
    const [bY, bM, bD] = b.date.split('-').map(Number);
    const aDate = new Date(today.getFullYear(), aM - 1, aD);
    const bDate = new Date(today.getFullYear(), bM - 1, bD);
    return aDate - bDate;
  });

  const todayBirthdays = sortedUpcoming.filter(
    (b) => getDaysUntilBirthday(b.date) === 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-start py-10 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl p-3">
        <h1 className="text-5xl font-bold text-center text-blue-900 mb-6">
          Upcoming Birthdays
        </h1>

        {/* 🎉 Today's Birthday Banner */}
        {todayBirthdays.length > 0 && (
          <div className="bg-yellow-100 text-red-600 font-bold p-3 rounded mb-6 flex items-center justify-center">
            <span className="mr-2 text-2xl">🎉</span>
            <span>
              Today is {todayBirthdays.map((b) => b.name).join(', ')}'s Birthday!
            </span>
          </div>
        )}

        {/* 🎂 Birthday Cards */}
        {sortedUpcoming.length > 0 ? (
          sortedUpcoming.map((birthday) => (
            <BirthdayCard
              key={birthday.id}
              birthday={birthday}
             
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No upcoming birthdays.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
