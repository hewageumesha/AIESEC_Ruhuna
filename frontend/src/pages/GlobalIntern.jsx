import React, { useEffect, useRef  } from "react";
import { useLocation } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

const GlobalIntern = () => {
  const location = useLocation();

  const goals = [
    {
      id: 1,
      title: "Good Health and Well-being",
      projects: 3,
      opportunities: 111,
      color: "bg-yellow-600",
    },
    {
      id: 2,
      title: "Quality Education",
      projects: 14,
      opportunities: 663,
      color: "bg-green-700",
    },
    {
      id: 3,
      title: "Gender Equality",
      projects: 4,
      opportunities: 20,
      color: "bg-blue-500",
    },
    {
      id: 4,
      title: "Decent Work and Economic Growth",
      projects: 6,
      opportunities: 286,
      color: "bg-green-500",
    },
    {
      id: 5,
      title: "Reduced Inequalities",
      projects: 2,
      opportunities: 30,
      color: "bg-blue-900",
    },
    {
      id: 6,
      title: "Responsible Consumption and Production",
      projects: 5,
      opportunities: 31,
      color: "bg-blue-900",
    },
    {
      id: 7,
      title: "Climate Action",
      projects: 3,
      opportunities: 53,
      color: "bg-blue-900",
    },
    {
      id: 8,
      title: "Life Below Water",
      projects: 2,
      opportunities: 35,
      color: "bg-blue-900",
    },
    {
      id: 9,
      title: "Life on Land",
      projects: 4,
      opportunities: 41,
      color: "bg-green-900",
    },
    {
      id: 10,
      title: "Partnerships for the Goals",
      projects: 5,
      opportunities: 138,
      color: "bg-blue-900",
    },
  ];

  useEffect(() => {
    if (location.hash === '#hero-section' || location.state?.shouldScroll) {
      const element = document.getElementById('hero-section');
      if (element) {
        window.scrollTo(0, 0);
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="font-sans dark:bg-gray-900">
      {/* Full-screen Hero Section */}
      <section id="hero-section" className="relative h-screen w-full overflow-hidden dark:bg-gray-900">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="/intern.webp"
            alt="Internship background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        </div>
        
        {/* Hero Content - Left Aligned */}
        <div className="relative z-20 h-full flex flex-col justify-center p-6 md:p-12 text-white">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Intern with AIESEC</h1>
            <p className="text-xl md:text-2xl mb-8">
              Develop your leadership while boosting your career prospects with an international internship in your field.
            </p>
            <button 
              className="text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#0CB9C1', '&:hover': { backgroundColor: '#0aa8b0' } }}
            >
              Become an intern
            </button>
          </div>
        </div>
      </section>

      {/* Global Client Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {/* Left side - Image */}
            <div className="md:w-1/2">
              <div className="relative rounded-lg overflow-hidden max-w-xxl mx-auto ">
                {/* Replace with your actual image */}
                <img
                  src="/globalTalent.webp"
                  alt="Global talent working together"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right side - Content cards */}
            <div className="md:w-1/2 space-y-8">
              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h2 className="text-2xl font-semibold text-[#0CB9C1] mb-3">
                  Get the multi-cultural work experience
                </h2>
                <p className="text-black dark:text-gray-300">
                  You can gain experience in new cross-cultural settings, equip yourself with new skills and add value to your workplace.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-[#0CB9C1] mb-3">
                  Find the industry for you
                </h3>
                <p className="text-black dark:text-gray-300">
                  Our pool of opportunities are growing across fields - we're sure you'll find one best fitting your background and experiences.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-[#0CB9C1] mb-3">
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

      <section className="py-12 px-4 sm:px-10 lg:px-20 text-center bg-white dark:bg-gray-900">
        <h2 className="text-4xl font-bold mb-2">Our projects</h2>
        <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
          Every project focuses on a target aligned to one of the 17 Sustainable Development Goals
        </p>
        <p className="text-lg font-medium mb-6">Select a goal that interests you</p>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
          >
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`w-48 h-80 flex-shrink-0 rounded-lg text-white flex flex-col items-center p-4 ${goal.color} transition transform hover:scale-105`}
              >
                <div className="text-3xl font-bold mb-1">{goal.id}</div>
                <div className="text-sm text-center font-medium mb-4">{goal.title}</div>
                <div className="border-t border-white w-full my-2"></div>
                <div className="text-sm font-semibold">{goal.projects} projects</div>
                <div className="text-xs">~ {goal.opportunities} opportunities</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <HiArrowLeft className="text-xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <HiArrowRight className="text-xl" />
            </button>
          </div>
        </div>
      </section>
  </div>
  );
};

export default GlobalIntern;