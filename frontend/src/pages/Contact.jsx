import { useState } from 'react';
import contacts from '../constants/committeeData';
import themeSlide from '../redux/theme/themeSlice.jsx'
import React from 'react';

const contact = () => {
  const [flippedCards, setFlippedCards] = useState([]);

  const toggleFlip = (index) => {
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter(i => i !== index));
    } else {
      setFlippedCards([...flippedCards, index]);
    }
  };

  return (
    <div className="min-h-scree py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300 dark:text-blue-50">
              Our Team
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-100">
            Meet the talented professionals who make it all happen
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-8">
          {contacts.map((contact, index) => (
            <div 
              key={index}
              className={`relative h-80 cursor-pointer transition-all duration-500 [transform-style:preserve-3d] group ${
                flippedCards.includes(index) ? '[transform:rotateY(180deg)]' : ''
              }`}
              onClick={() => toggleFlip(index)}
            >
              {/* Front of Card */}
              <div className={`absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center [backface-visibility:hidden] transition-all duration-300 group-hover:shadow-2xl ${
                flippedCards.includes(index) ? 'hidden' : 'block'
              }`}>
                <div className="relative mb-6">
                  <img 
                    src={contact.image} 
                    alt={contact.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800 text-center dark:text-blue-50">
                  {contact.name}
                </h2>
                <p className="text-blue-500 font-medium mt-2">{contact.position}</p>
                <div className="mt-6 flex space-x-4">
                  <a href={`mailto:${contact.email}`} onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-blue-500 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Back of Card */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow-xl p-6 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] text-white ${
                flippedCards.includes(index) ? 'block' : 'hidden'
              }`}>
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Contact Details
                </h3>
                <div className="space-y-4 flex-grow">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="text-sm font-medium opacity-80">Position</p>
                    <p className="text-lg font-semibold">{contact.position}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="text-sm font-medium opacity-80">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-lg font-semibold hover:underline break-words">
                      {contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default contact;