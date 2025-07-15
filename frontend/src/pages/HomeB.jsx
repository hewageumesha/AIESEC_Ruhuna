import React, { useEffect, useState } from 'react';
import BirthdayCard from '../components/BirthdayCard';
import { getDaysUntilBirthday } from '../utils/dateUtils';

const HomeB = ({ setTodayCount }) => {
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    fetch('https://aiesecinruhuna-production.up.railway.app/api/birthdays')
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();
        const upcoming = data.filter((b) => {
          const [year, month, day] = b.date.split('-').map(Number);
          const birthdayDate = new Date(today.getFullYear(), month - 1, day);

          // Include only upcoming or today’s birthdays
          return birthdayDate >= today;
        });

        setBirthdays(upcoming);

        // Count birthdays happening today
        const todayCount = upcoming.filter((b) => getDaysUntilBirthday(b.date) === 0).length;
        if (typeof setTodayCount === "function") {
          setTodayCount(todayCount);
        }
      })
      .catch((error) => console.error('Error fetching birthdays:', error));
  }, [setTodayCount]);

  const sortedUpcoming = [...birthdays].sort((a, b) => {
    const [aY, aM, aD] = a.date.split('-').map(Number);
    const [bY, bM, bD] = b.date.split('-').map(Number);
    const today = new Date().getFullYear();
    const aDate = new Date(today, aM - 1, aD);
    const bDate = new Date(today, bM - 1, bD);
    return aDate - bDate;
  });

   return (
    <div className="min-h-screen bg-gradient-to-br from-[#feffff] to-[#f8f9fc] dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-start py-10 px-4">
      <div className="bg-[#feffff] dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#060e0e] dark:text-white mb-8">
          Upcoming Birthdays 🎂
        </h1>

        {sortedUpcoming.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {sortedUpcoming.map((birthday) => (
              <div key={birthday.id} className="w-full sm:w-[48%] lg:w-[30%]">
                <BirthdayCard birthday={birthday} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center text-lg">No upcoming birthdays.</p>
        )}
      </div>
    </div>
  );
};

export default HomeB;
