import React from 'react';
import { getAgeAndDisplayDate, getDaysUntilBirthday, getColorCode } from '../utils/dateUtils';

const BirthdayCard = ({ birthday, onSendEmail }) => {
  const ageText = getAgeAndDisplayDate(birthday.date);
  const daysUntil = getDaysUntilBirthday(birthday.date);
  const color = getColorCode(daysUntil);
  const birthdayMessage = getAgeAndDisplayDate(birthday.date);

  const isValidUrl =
    birthday.photoUrl &&
    birthday.photoUrl.trim().toLowerCase() !== 'null' &&
    birthday.photoUrl.trim().toLowerCase() !== 'undefined';

  const imageUrl = isValidUrl
    ? birthday.photoUrl
    : 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png';

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 ${color}`}>
      <div className="flex items-center mb-4">
        <img
          src={imageUrl}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png';
          }}
          alt={`${birthday.name}'s birthday photo`}
          className="w-20 h-20 rounded-full object-cover border-2 border-green-500 dark:border-green-300 mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{birthday.name}</h3>
          <p className="text-gray-600 dark:text-gray-300">{birthday.role}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-200">
        <i className="fas fa-birthday-cake mr-2" />
        {birthday.date}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{daysUntil} days until birthday</p>
      <p className={`text-gray-700 dark:text-gray-200 ${color}`}>🎂 {birthdayMessage}</p>
      <div className="flex justify-end mt-4">
        {/* Optional action buttons */}
      </div>
    </div>
  );
};

export default BirthdayCard;
