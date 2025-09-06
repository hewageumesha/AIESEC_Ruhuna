import React from 'react';
import { getAgeAndDisplayDate, getDaysUntilBirthday, getColorCode } from '../utils/dateUtils';

const BirthdayCard = ({ birthday }) => {
  const birthDate = new Date(birthday.birthday); // <-- updated field
  const ageText = getAgeAndDisplayDate(birthDate);
  const daysUntil = getDaysUntilBirthday(birthDate);
  const color = getColorCode(daysUntil);

  const imageUrl =
    birthday.photoUrl && birthday.photoUrl.trim() !== ''
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
        🎂 {ageText} ({daysUntil} days until birthday)
      </p>
    </div>
  );
};

export default BirthdayCard;
