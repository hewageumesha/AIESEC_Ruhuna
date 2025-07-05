import React ,{ useEffect }from "react";
import { useLocation } from 'react-router-dom';
import { scrollToSection } from '../utils/Scroll';

const GlobalTeacher = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#hero-section' || location.state?.shouldScroll) {
      const element = document.getElementById('hero-section');
      if (element) {
        window.scrollTo(0, 0);
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="font-sans">
      {/* Full-screen Hero Section */}
      <section id="hero-section" className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="/teacher.webp"
            alt="Internship background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        </div>
        
        {/* Hero Content - Left Aligned */}
        <div className="relative z-20 h-full flex flex-col justify-center p-6 md:p-12 text-white">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Teach with AIESEC</h1>
            <p className="text-xl md:text-2xl mb-8">
              Develop your leadership while boosting your career prospects with an opportunity to work as a teacher abroad.
            </p>
            <button 
              className="text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#F48924', '&:hover': { backgroundColor: '#0aa8b0' } }}
            >
              Become an teacher
            </button>
          </div>
        </div>
      </section>

        {/* Global Client Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white  dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative rounded-lg overflow-hidden max-w-xxl mx-auto">
              {/* Replace with your actual image */}
              <img
                src="/globalTeacher.webp"
                alt="Global talent working together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content cards */}
          <div className="md:w-1/2 space-y-8">
            <div className="p-6 bg-gray-50 rounded-lg  dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-[#F48924] mb-3">
                Experience cross-cultural environment
              </h2>
              <p className="text-black dark:text-gray-300">
                You can gain experience in new cross-cultural settings, equip yourself with new skills and add value to the school or institution you will work in
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg  dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-[#F48924] mb-3">
                Try somthing new or refine your skills
              </h3>
              <p className="text-black dark:text-gray-300">
                Our teaching opportunities are very diverse - whether looking to teach for the first time or your're already an experienced teacher, you will find an opportunity looking for someone like you!
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg  dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-[#F48924] mb-3">
                Gain a professional edge
              </h3>
              <p className="text-black dark:text-gray-300">
                Our partners are dedicated to providing you with an enriching leadership experience sure to put you ahead of your peers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
</div>
  );
};

export default GlobalTeacher;