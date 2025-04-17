// src/utils/dateUtils.js

export const getAgeAndDisplayDate = (birthdateStr) => {
    const today = new Date();
    const birthDate = new Date(birthdateStr);
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
    let age = today.getFullYear() - birthDate.getFullYear();
    if (thisYearBirthday > today) {
      age--; // hasn't had birthday yet this year
    }
  
    const displayDate = thisYearBirthday.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    return `Turns ${age + 1} on ${displayDate}`;
  };
  
  export const getDaysUntilBirthday = (birthdateStr) => {
    const today = new Date();
    const birthDate = new Date(birthdateStr);
    const thisYear = today.getFullYear();
    const nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
  
    if (nextBirthday < today) {
      nextBirthday.setFullYear(thisYear + 1);
    }
  
    const diffTime = nextBirthday - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // in days
  };
  
  export const getColorCode = (days) => {
    if (days === 0) return 'text-red-500'; // Today
    if (days <= 6) return 'text-yellow-500'; // Soon
    return 'text-blue-500'; // Upcoming
  };
  