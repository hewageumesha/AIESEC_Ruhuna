import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Card } from "flowbite-react";
import BirthdayCard from "../../components/birthday/BirthdayCard";

export default function HomeB({ setTodayCount }) {
  const [birthdays, setBirthdays] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      const res = await axios.get("https://aiesecruhuna-production.up.railway.app/api/users/birthdays");
      const today = new Date();

      const upcoming = res.data
        .map((b) => ({
          ...b,
          birthday: new Date(b.birthday),
        }))
        .filter((b) => {
          const bd = b.birthday;
          const birthdayThisYear = new Date(
            today.getFullYear(),
            bd.getMonth(),
            bd.getDate()
          );
          return birthdayThisYear >= today;
        });

      setBirthdays(upcoming);

      const todayCount = upcoming.filter(
        (b) =>
          b.birthday.getDate() === today.getDate() &&
          b.birthday.getMonth() === today.getMonth()
      ).length;

      if (typeof setTodayCount === "function") {
        setTodayCount(todayCount);
      }
    } catch (err) {
      setErrorMsg("Failed to fetch birthdays!");
    }
  };

  const sortedUpcoming = [...birthdays].sort((a, b) => {
    const year = new Date().getFullYear();
    const aDate = new Date(year, a.birthday.getMonth(), a.birthday.getDate());
    const bDate = new Date(year, b.birthday.getMonth(), b.birthday.getDate());
    return aDate - bDate;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-50">
        Upcoming Birthdays 🎂
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-[rgb(26,35,58)]">
        {errorMsg && (
          <Alert color="failure" className="mb-4">
            {errorMsg}
          </Alert>
        )}

        {sortedUpcoming.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUpcoming.map((birthday) => (
              <Card
                key={birthday.name}
                className="bg-white dark:bg-[rgb(30,41,59)]"
              >
                <BirthdayCard birthday={birthday} />
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg dark:text-gray-300">
            No upcoming birthdays.
          </p>
        )}
      </div>
    </div>
  );
}
