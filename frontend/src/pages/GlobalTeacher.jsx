import React, { useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { MdAutoStories } from "react-icons/md";
import { GrUserAdmin, GrOptimize } from "react-icons/gr";
import { SiActigraph } from "react-icons/si";
import PropTypes from 'prop-types';
import { FaGlobeAmericas, FaGlobeAfrica, FaGlobeAsia, FaGlobeEurope } from "react-icons/fa";

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

  const goals = [
    {
      id: 1,
      title: "Americas",
      opportunities: 30,
      img: <FaGlobeAmericas  className="w-20 h-20 center" />,
    },
    {
      id: 2,
      title: "Europe",
      opportunities: 106,
      img: <FaGlobeEurope  className="w-20 h-20 center" />,
    },
    {
      id: 3,
      title: "Middle East and Africa",
      opportunities: 34,
      img: <FaGlobeAfrica  className="w-20 h-20 center" />,
    },
    {
      id: 4,
      title: "Asia Pacific",
      opportunities: 105,
      img: <FaGlobeAsia  className="w-20 h-20 center" />,
    },
  ];

  const STEP = [
    {
      step: "01",
      title: "Sign up",
      description: [
        "Create an account on our platform and fill in all the details on your profile."
      ],
      image: "/sign-up/for-volunteer.webp"
    },
    {
      step: "02",
      title: "Find an internship",
      description: [
        "Use the filters in our search page and find the opportunities that fit your background and profile and that spark your interest."
      ],
      image: "/sign-up/find-project-volunteer.webp"
    },
    {
      step: "03",
      title: "Go through the selection process",
      description: [
        "After you apply for an opportunity you will be contacted by us and receive information on the selection process."
      ],
      image: "/sign-up/process-volunteer.webp"
    },
    {
      step: "04",
      title: "Get ready",
      description: [
        "Once you’re selected, it’s time to pack your bags and prepare all the logistics - don’t worry we’ll be there to help!"
      ],
      image: "/sign-up/ready-volunteer.webp"
    }
  ];

  const StepItem = ({ step, title, description, image }) => (
    <div className="relative">
      <div className="absolute left-6 h-full w-0.5 bg-[#F48924] transform -translate-x-1/2"></div>
      <div className="relative pl-16 mb-16">
        <div className="absolute left-0 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#F48924] flex items-center justify-center text-white font-bold text-lg">
            {step}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="md:flex gap-8">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">{title}</h2>
              {Array.isArray(description) ? (
                <div className="text-gray-600 dark:text-gray-300">
                  {description.map((item, i) => (
                    <p key={i} className="mb-4">{item}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  StepItem.propTypes = {
    step: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    image: PropTypes.string.isRequired
  };

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
    <div className="font-sans">
      <section id="hero-section" className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/teacher.webp"
            alt="Internship background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        </div>
        <div className="relative z-20 h-full flex flex-col justify-center p-6 md:p-12 text-white">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Teach with AIESEC</h1>
            <p className="text-xl md:text-2xl mb-8">
              Develop your leadership while boosting your career prospects with an opportunity to work as a teacher abroad.
            </p>
            <button
              className="text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#F48924' }}
            >
              Become a teacher
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

      

      {/* Our projects Section */}
      <section className="py-12 px-4 md:px-10 lg:px-20 text-center bg-white dark:bg-gray-900">
        <h2 className="text-4xl font-bold mb-2">Our experiences</h2>
        <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
          We have categorised our teaching experiences to help you find the right one.
        </p>
        <p className="text-lg font-medium mb-6">Select an experience that interests you</p>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar max-w-screen-lg mx-auto"
          >
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="w-52 h-72 flex-shrink-0 rounded-lg text-white flex flex-col items-center p-4 bg-[#F48924] dark:bg-[#705337] transition transform hover:scale-105"
              >
                <div className="text-3xl font-bold mb-1">{goal.id}</div>
                <div className="text-sm text-center font-medium mb-4">{goal.title}</div>
                <div className="border-t border-white w-full my-2"></div>
                <div className="text-xs">~ {goal.opportunities} opportunities</div>
                <div className="mb-2">{goal.img}</div>
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

      <section className="py-16 px-6 bg-white dark:bg-[rgb(16,23,42)]">
        <div className="max-w-6xl mx-auto">        
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3 lg:sticky lg:top-20 lg:h-fit">
              <div className="p-8 rounded-lg">
                <h2 className="text-5xl font-bold text-center mb-12 text-[#F48924]">Become a teacher</h2>
                <p className="text-2xl text-center mb-8 dark:text-gray-300">
                  It takes only 4 steps to become a teacher
                </p>
                <div className="flex justify-center">
                  <div className="h-1 w-24 bg-[#F48924]"></div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-12">
              {STEP.map((item, index) => (
                <StepItem key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Support Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {/* Left side - Images */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <div className="relative rounded-lg overflow-hidden w-full">
                <img
                  src="/support-volunteer.webp"
                  alt="AIESEC support group"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Our Support</h2>
              <p className="text-black dark:text-gray-300 mb-6">
                Our AIESEC members in both your home and host Countries/Territories will make sure to be there every step of the way before leaving for your project and while you are abroad!
              </p>

              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-[#F48924] mb-2">Logistics Support ✅</h3>
                <p className="text-black dark:text-gray-300">
                  We ensure you get the right visa, arrival pick-up information before you travel and departure instructions when you’re going back.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-[#F48924] mb-2">Safe living conditions ✅</h3>
                <p className="text-black dark:text-gray-300">
                  Life and health insurance is mandatory for taking part in an AIESEC program. You will get information about accommodation and basic living costs.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-[#F48924] mb-2">Learning experience ✅</h3>
                <p className="text-black dark:text-gray-300">
                  We set clear expectations, provide cultural preparation and facilitate learning spaces before, during and after your experience.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-[#F48924] mb-2">Clear job description ✅</h3>
                <p className="text-black dark:text-gray-300">
                  We accompany you to the workplace on the first day, ensure your job description and goals are clear, and your working hours and duration is as expected.
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
