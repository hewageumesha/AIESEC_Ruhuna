import React, { useRef, useEffect } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { MdAllInclusive, MdAutoStories } from "react-icons/md";
import { GrGrow, GrUserAdmin, GrOptimize } from "react-icons/gr";
import { FaFish } from "react-icons/fa";
import { SiActigraph } from "react-icons/si";
import { GiWorld } from "react-icons/gi";
import { GoGoal } from "react-icons/go";
import { BiShapeCircle } from "react-icons/bi";
import PropTypes from 'prop-types';

const GlobalVolunteer = () => {
  const goals = [
    {
      id: 1,
      title: "Good Health and Well-being",
      projects: 3,
      opportunities: 111,
      img: <SiActigraph className="w-20 h-20 center" />,
    },
    {
      id: 2,
      title: "Quality Education",
      projects: 14,
      opportunities: 663,
      img: <MdAutoStories className="w-20 h-20 center" />,
    },
    {
      id: 3,
      title: "Gender Equality",
      projects: 4,
      opportunities: 20,
      img: <GrUserAdmin className="w-20 h-20 center" />,
    },
    {
      id: 4,
      title: "Decent Work and Economic Growth",
      projects: 6,
      opportunities: 286,
      img: <GrOptimize className="w-20 h-20 center" />,
    },
    {
      id: 5,
      title: "Reduced Inequalities",
      projects: 2,
      opportunities: 30,
      img: <BiShapeCircle className="w-20 h-20 center" />,
    },
    {
      id: 6,
      title: "Responsible Consumption and Production",
      projects: 5,
      opportunities: 31,
      img: <MdAllInclusive className="w-20 h-20 center" />,
    },
    {
      id: 7,
      title: "Climate Action",
      projects: 3,
      opportunities: 53,
      img: <GiWorld className="w-20 h-20 center" />,
    },
    {
      id: 8,
      title: "Life Below Water",
      projects: 2,
      opportunities: 35,
      img: <FaFish className="w-20 h-20 center" />,
    },
    {
      id: 9,
      title: "Life on Land",
      projects: 4,
      opportunities: 41,
      img: <GrGrow className="w-20 h-20 center" />,
    },
    {
      id: 10,
      title: "Partnerships for the Goals",
      projects: 5,
      opportunities: 138,
      img: <GoGoal className="w-20 h-20 center" />,
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
      step: "2",
      title: "Find a project",
      description: [
        "Use the filters in our search page and find the projects that you are most interested in."
      ],
      image: "/sign-up/find-project-volunteer.webp"
    },
    {
      step: "03",
      title: "Go through the selection process",
      description: [
        "After you apply for a project you will be contacted and receive information on the selection process."
      ],
      image: "/sign-up/process-volunteer.webp"
    },
    {
      step: "04",
      title: "Get ready",
      description: [
        "Once you’re selected, it’s time to pack your bags and prepare all the logistic - don’t worry we’ll be there to help!"
      ],
      image: "/sign-up/ready-volunteer.webp"
    }
  ];

  const StepItem = ({ step, title, description, image }) => (
    <div className="relative">
      <div className="absolute left-6 h-full w-0.5 bg-[#F85A40] transform -translate-x-1/2"></div>
      <div className="relative pl-16 mb-16">
        <div className="absolute left-0 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#F85A40] flex items-center justify-center text-white font-bold text-lg">
            {step}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="md:flex gap-8">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg" loading="lazy" />
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
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    image: PropTypes.string.isRequired
  };

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/volunteer.webp" alt="Background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        </div>
        <div className="relative z-20 h-full flex flex-col justify-center p-6 md:p-12 text-white">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Volunteer with AIESEC</h1>
            <p className="text-xl md:text-2xl mb-8">
              Develop your leadership through a volunteering project contributing to the Sustainable Development Goals
            </p>
            <button className="text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg" style={{ backgroundColor: '#F85A40' }}>
              Become a volunteer
            </button>
          </div>
        </div>
      </section>

      {/* Global Client Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="md:w-1/2">
              <img src="/globalVolunteer.png" alt="Global talent" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="md:w-1/2 space-y-8">
              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h2 className="text-2xl font-semibold text-[#F85A40] mb-3">Experience new cultures</h2>
                <p className="text-black dark:text-gray-300">There's nothing like being in a foreign Country/Territory, living and volunteering with people from all around the world, being exposed to different points of view and ways of living.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-[#F85A40] mb-3">Make an impact</h3>
                <p className="text-black dark:text-gray-300">On a Global Volunteer project with AIESEC, you work towards tackling the issues you're most passionate about with one of the Sustainable Development Goals of the United Nations.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-[#F85A40] mb-3">Challenge yourself</h3>
                <p className="text-black dark:text-gray-300">Our projects are packed with opportunities to try something new, push you out of your comfort zone and discover the best version of yourself - because growth happens beyond your comfort zone!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Projects Section */}
      <section className="py-12 px-4 md:px-10 lg:px-20 text-center bg-white dark:bg-gray-900">
        <h2 className="text-4xl font-bold mb-2">Our projects</h2>
        <p className="text-gray-500 mb-8 max-w-2xl mx-auto">Every project focuses on a target aligned to one of the 17 Sustainable Development Goals</p>
        <p className="text-lg font-medium mb-6">Select a goal that interests you</p>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar max-w-screen-lg mx-auto"
          >
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="w-52 h-72 flex-shrink-0 rounded-lg text-white flex flex-col items-center p-4 bg-[#ef7b69] dark:bg-[#48211b] transition transform hover:scale-105"
              >
                <div className="text-3xl font-bold mb-1">{goal.id}</div>
                <div className="text-sm text-center font-medium mb-4">{goal.title}</div>
                <div className="border-t border-white w-full my-2"></div>
                <div className="text-sm font-semibold">{goal.projects} projects</div>
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

      {/* Steps Section */}
      <section className="py-16 px-6 bg-white dark:bg-[rgb(16,23,42)]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 lg:sticky lg:top-20 lg:h-fit">
            <div className="p-8 rounded-lg">
              <h2 className="text-5xl font-bold text-center mb-12 text-[#F85A40]">Become a volunteer</h2>
              <p className="text-2xl text-center mb-8 dark:text-gray-300">It takes only 4 steps to become a volunteer</p>
              <div className="flex justify-center">
                <div className="h-1 w-24 bg-[#F85A40]"></div>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 space-y-12">
            {STEP.map((item, index) => (
              <StepItem key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="relative rounded-lg overflow-hidden w-full">
              <img src="/support-volunteer.webp" alt="AIESEC support group" className="w-full h-auto object-cover" />
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Our Support</h2>
            <p className="text-black dark:text-gray-300 mb-6">Our AIESEC members in both your home and host Countries/Territories will make sure to be there every step of the way before leaving for your project and while you are abroad!</p>
            <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-[#F85A40] mb-2">Logistics Support ✅</h3>
              <p className="text-black dark:text-gray-300">We ensure you get the right visa, arrival pick-up information before you travel and departure instructions when you’re going back.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-[#F85A40] mb-2">Safe living conditions ✅</h3>
              <p className="text-black dark:text-gray-300">Life and health insurance is mandatory for taking part in an AIESEC program. You will get information about accommodation and basic living costs.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-[#F85A40] mb-2">Learning experience ✅</h3>
              <p className="text-black dark:text-gray-300">We set clear expectations, provide cultural preparation and facilitate learning spaces before, during and after your experience.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-[#F85A40] mb-2">Clear job description ✅</h3>
              <p className="text-black dark:text-gray-300">We accompany you to the workplace on the first day, ensure your job description and goals are clear, and your working hours and duration is as expected.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlobalVolunteer;
