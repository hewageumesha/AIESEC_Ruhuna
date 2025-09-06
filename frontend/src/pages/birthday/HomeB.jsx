import React, { useEffect, useState } from 'react';
import BirthdayCard from '../../components/birthday/BirthdayCard';
import { getAgeAndDisplayDate, getDaysUntilBirthday, getColorCode } from '../../utils/dateUtils';


const HomeB = ({ setTodayCount }) => {
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/birthdays')
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();

        const upcoming = data
          .map((b) => ({
            ...b,
            birthday: new Date(b.birthday), // convert string to Date object
          }))
          .filter((b) => {
            const bd = b.birthday;
            const birthdayThisYear = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
            return birthdayThisYear >= today; // upcoming or today
          });

        setBirthdays(upcoming);

        const todayCount = upcoming.filter(
          (b) =>
            b.birthday.getDate() === today.getDate() &&
            b.birthday.getMonth() === today.getMonth()
        ).length;

        if (typeof setTodayCount === 'function') {
          setTodayCount(todayCount);
        }
      })
      .catch((error) => console.error('Error fetching birthdays:', error));
  }, [setTodayCount]);

  const sortedUpcoming = [...birthdays].sort((a, b) => {
    const today = new Date().getFullYear();
    const aDate = new Date(today, a.birthday.getMonth(), a.birthday.getDate());
    const bDate = new Date(today, b.birthday.getMonth(), b.birthday.getDate());
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
              <div key={birthday.name} className="w-full sm:w-[48%] lg:w-[30%]">
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
