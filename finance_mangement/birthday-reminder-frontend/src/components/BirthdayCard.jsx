import React from 'react';
import { getAgeAndDisplayDate,getDaysUntilBirthday,
  getColorCode, } from '../utils/dateUtils';

const BirthdayCard = ({ birthday, onSendEmail}) => {
  const ageText = getAgeAndDisplayDate(birthday.date);
  const daysUntil = getDaysUntilBirthday(birthday.date);
  const color = getColorCode(daysUntil);
  const birthdayMessage = getAgeAndDisplayDate(birthday.date);
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md mb-4 ${color}`}>
      <div className="flex items-center mb-4">
        <img
          src={birthday.photoUrl}
          alt={`${birthday.name}'s birthday photo`}
          className="w-20 h-20 rounded-full object-cover border-2 border-green-500 mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{birthday.name}</h3>
          <p className="text-gray-600">{birthday.role}</p>
          
        </div>
        
      </div>
      <p className="text-gray-700">
        <i className="fas fa-birthday-cake mr-2" />
        {birthday.date}
      </p>
      <p className="text-gray-500 text-sm mt-2">
        {daysUntil} days until birthday
      </p>
      <p className={`text-gray-700 ${color}`}>
        🎂 {birthdayMessage}
      </p>

      <div className="flex justify-end mt-4">
  
</div>

    </div>
  );
};

export default BirthdayCard;
