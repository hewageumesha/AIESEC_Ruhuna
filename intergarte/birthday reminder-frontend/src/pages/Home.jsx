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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0CB9C1] to-[#52565E] flex flex-col items-center justify-start py-10 px-4">
      <div className="bg-[#52565E] rounded-2xl shadow-2xl w-full max-w-7xl p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#0CB9C1] mb-8">
          Upcoming Birthdays 🎂
        </h1>

        {/* 🎂 Birthday Cards */}
        {sortedUpcoming.length > 0 ? (
          sortedUpcoming.map((birthday) => (
            <BirthdayCard
              key={birthday.id}
              birthday={birthday}
            />
          ))
        ) : (
          <p className="text-gray-600 text-center text-lg">No upcoming birthdays.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
