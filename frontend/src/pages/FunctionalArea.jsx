import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { HiSparkles, HiOutlineLightBulb, HiGlobeAlt, HiUsers } from 'react-icons/hi2';

const FunctionalAreas = () => {
  const [activeArea, setActiveArea] = useState('front');

  const frontOfficeData = [
    {
      id: 1,
      title: 'Incoming Global Talent (IGT)',
      description: 'Connect international talents with local opportunities and build strong partnerships.',
      icon: <HiGlobeAlt className="w-10 h-10 text-[#037EF3]" />
    },
    {
      id: 2,
      title: 'Outgoing Global Volunteer (OGV)',
      description: 'Empower students to volunteer abroad and create social impact through global projects.',
      icon: <HiUsers className="w-10 h-10 text-[#037EF3]" />
    },
    {
      id: 3,
      title: 'Business Development (BD)',
      description: 'Drive collaborations with external partners and secure resources to scale our impact.',
      icon: <HiOutlineLightBulb className="w-10 h-10 text-[#037EF3]" />
    },
    {
      id: 4,
      title: 'Marketing & Communications (MKT)',
      description: 'Build our brand story, create eye-catching content, and inspire youth to take action.',
      icon: <HiSparkles className="w-10 h-10 text-[#037EF3]" />
    },
  ];

  const backOfficeData = [
    {
      id: 1,
      title: 'Talent Management (TM)',
      description: 'Shape member experiences, develop leaders, and foster a growth culture.',
      icon: <HiUsers className="w-10 h-10 text-[#037EF3]" />
    },
    {
      id: 2,
      title: 'Finance & Legal (FL)',
      description: 'Ensure financial sustainability, legal compliance, and strategic resource allocation.',
      icon: <HiOutlineLightBulb className="w-10 h-10 text-[#037EF3]" />
    },
    {
      id: 3,
      title: 'Operations Support',
      description: 'Drive efficiency through smart processes, internal systems, and smooth coordination.',
      icon: <HiGlobeAlt className="w-10 h-10 text-[#037EF3]" />
    },
    {
      id: 4,
      title: 'Information Management (IM)',
      description: 'Empower teams with data insights, tools, and knowledge sharing.',
      icon: <HiSparkles className="w-10 h-10 text-[#037EF3]" />
    },
  ];

  const dataToDisplay = activeArea === 'front' ? frontOfficeData : backOfficeData;

  return (
    <div className="py-20 px-6 bg-gradient-to-b from-[#f0f4ff] to-white dark:from-[rgb(16,23,42)] dark:to-black font-sans">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#037EF3] to-[#0CB9C1]"
            >
            Discover Your Place in AIESEC
        </motion.h2>


        <p className="text-lg mb-12 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Choose the functional area that matches your passions and help create a better world together!
        </p>

        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          <button
            onClick={() => setActiveArea('front')}
            className={`px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#037EF3] to-[#0CB9C1] hover:opacity-90 transition-all duration-300
                ${activeArea === 'front' ? '' : 'opacity-60'}`}
            >
            Front Office
            </button>

            <button
            onClick={() => setActiveArea('back')}
            className={`px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#037EF3] to-[#0CB9C1] hover:opacity-90 transition-all duration-300
                ${activeArea === 'back' ? '' : 'opacity-60'}`}
            >
            Back Office
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dataToDisplay.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <AreaCard title={item.title} description={item.description} icon={item.icon} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AreaCard = ({ title, description, icon }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

AreaCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

export default FunctionalAreas;
