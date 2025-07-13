import React, { useRef, useEffect, useState } from "react";
import PropTypes from 'prop-types';

const BecomeMember = () => {
  const INITIAL_FAQS = [
  {
    question: "Customer Experience",
    answer: "Support youth from your country/territory to connect with our experiences abroad. You'll work with AIESEC offices overseas and help guide young people who choose to take up an AIESEC exchange experience.\n\nSkills you can gain: Sales, customer service, communication, project management.",
    isOpen: false
  },
  {
    question: "Marketing",
    answer: "Use your creativity and analytical skills to create promotional campaigns to attract customers to our programs, events, and initiatives. You'll analyze customer insights, brainstorm ideas, and collaborate to make them happen - all to better project our brand, reach, and impact.\n\nSkills you can gain: Brand management, data analysis, social media",
    isOpen: false
  },
  {
    question: "Sales & Business Development",
    answer: "Work on corporate or non0corporates sales by engaging local companies and organizations to create internships, projects, or events for youth. You'll manage client relationships, learn how organizations work, and help interns settle in your country/territory.\n\nSkills you can gain: Sales, customer service, project management",
    isOpen: false
  },
  {
    question: "Finance",
    answer: "Play a critical role in ensuring our local operational strategies are executed effectively and efficiently. You'll monitor finances, provide investment strategies, ensure we are complying with the law and our internal policies, and make sure we'll still be here in the future.\n\n Skills you can gain: Strategic planning, budgeting, resources management",
    isOpen: false
  },
  {
    question: "Human Resources",
    answer: "It's only by investing in finding and developing the best in our people that we can grow as an organization. You'll design training and development plans, track performance, and create systems that celebrate achievement as well as recruit new people into your local team.\n\nSkills you can gain: communication skills, HR processes management, recruitment",
    isOpen: false
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
      title: "Go through our selection process",
      description: [
        "Each of our local teams has specific times of the year when new members are recruited. After you sign up, you will get to know what are the next steps to become a member of your local team."
      ],
      image: "/sign-up/find-project-volunteer.webp"
    },
    {
      step: "03",
      title: "Welcome Onboard!",
      description: [
        "If you are successful in the selection process, you will then be welcomed into one of our teams, receive an induction, and start a new role as a team member. Your leadership development experience starts now!"
      ],
      image: "/sign-up/process-volunteer.webp"
    }
  ];

  const FAQItem = ({ question, answer, isOpen, toggle }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
    <button
      className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls={`faq-${question.replace(/\s+/g, '-')}`}
    >
      <h3 className="text-xl font-semibold dark:text-white">{question}</h3>
      <span className="text-2xl text-blue-600 dark:text-blue-400">
        {isOpen ? '-' : '+'}
      </span>
    </button>
    
    {isOpen && (
      <div id={`faq-${question.replace(/\s+/g, '-')}`} className="p-6 pt-0 bg-white dark:bg-gray-800">
        {answer.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="text-gray-600 dark:text-gray-300 mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    )}
  </div>
);

  const StepItem = ({ step, title, description, image }) => (
    <div className="relative">
      <div className="absolute left-6 h-full w-0.5 bg-[#037EF3] transform -translate-x-1/2"></div>
      <div className="relative pl-16 mb-16">
        <div className="absolute left-0 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#037EF3] flex items-center justify-center text-white font-bold text-lg">
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

  const VALUES = [
    {
      title: "Demonstrating Integrity",
      description: "By doing what's right over what's easy, you develop leadership that demonstrates integrity.",
      icon: (
        <svg className="w-6 h-6 text-[#037EF3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      colorClass: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Acting Sustainably",
      description: "In various leadership roles at AIESEC, you get to make long-term decisions that build your mindset to also think of your future generations and live sustainably.",
      icon: (
        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      colorClass: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Striving for Excellence",
      description: "By taking up challenging opportunities with AIESEC, you get to continuously grow through creativity and innovation.",
      icon: (
        <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      colorClass: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      title: "Activating Leadership",
      description: "At AIESEC, you get to lead by example and with empathy by taking responsibility of inspiring others to lead as well.",
      icon: (
        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      colorClass: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Enjoying Participation",
      description: "At AIESEC, you get to celebrate and enjoy the way we are and put your youthful energy and enthusiasm in everything you do.",
      icon: (
        <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      colorClass: "bg-pink-100 dark:bg-pink-900/30"
    },
    {
      title: "Living Diversity",
      description: "You get to work in inclusive spaces that allow you to truly be yourself and embrace each other's differences as a strength.",
      icon: (
        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      colorClass: "bg-indigo-100 dark:bg-indigo-900/30"
    }
  ];

  // Reusable Components
  const SectionHeader = ({ title, description, className = "" }) => (
    <div className={`text-center mb-16 ${className}`}>
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      {description && <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{description}</p>}
    </div>
  );

  const ValueCard = ({ title, description, icon, colorClass }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );

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

  const [faqs, setFaqs] = useState(INITIAL_FAQS);

  const toggleFaq = (index) => {
    setFaqs(prevFaqs => prevFaqs.map((faq, i) => ({
      ...faq,
      isOpen: i === index ? !faq.isOpen : false
    })));
  };

  return (
    <div className="font-sans">
      {/* Full-screen Hero Section */}
      <section id="hero-section" className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="/member.webp"
            alt="Internship background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        </div>
        
        {/* Hero Content - Left Aligned */}
        <div className="relative z-20 h-full flex flex-col justify-center p-6 md:p-12 text-white">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Become an AIESEC member</h1>
            <p className="text-xl md:text-2xl mb-8">
              Develop yourslef through practical experiences in the world's largest youth-led organization
            </p>
            <button 
              className="text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#037EF3', '&:hover': { backgroundColor: '#0aa8b0' } }}
            >
              Become an member
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
                src="/becomeMember.webp"
                alt="Global talent working together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content cards */}
          <div className="md:w-1/2 space-y-8">
            <div className="p-6 bg-gray-50 rounded-lg  dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-[#037EF3] mb-3">
                Develop yourself
              </h2>
              <p className="text-black dark:text-gray-300">
                Develop self-management ans interpersonal skills through practical leaning experiences to emerge as a well rounded individual.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg  dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-[#037EF3] mb-3">
                Learn to lead
              </h3>
              <p className="text-black dark:text-gray-300">
                Get an emprowering & challenging environment where you can develop into a value-driven leader.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg  dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-[#037EF3] mb-3">
                Build your network
              </h3>
              <p className="text-black dark:text-gray-300">
                Connect with people from all over the world and build your own local and international network of like-minded young people.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg  dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-[#037EF3] mb-3">
                Connect with aiesec impact
              </h3>
              <p className="text-black dark:text-gray-300">
                Contribute for a better world through the programs we offer and further leadership opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Steps Section */}
      <section className="py-16 px-6 bg-white dark:bg-[rgb(16,23,42)]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 lg:sticky lg:top-20 lg:h-fit">
            <div className="p-8 rounded-lg">
              <h2 className="text-5xl font-bold text-center mb-12 text-[#037EF3]">Join AIESEC</h2>
              <p className="text-2xl text-center mb-8 dark:text-gray-300">It takes only 3 steps to become an AIESEC member</p>
              <div className="flex justify-center">
                <div className="h-1 w-24 bg-[#037EF3]"></div>
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

      {/* Values Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader 
            title="We create value-driven leaders" 
            description="AIESEC enables you to develop the values we believe leaders should live by." 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-4 dark:text-white">The roles we offer</h2>
              <p className="text-xl dark:text-gray-300">
                When you join one of our local teams located in over 109 countries and territories, you are allocated to a specific department.
              </p>
              <p text-md dark:text-gray-300>
                While each local team has different structures and the department names can vary, these are the main areas you could gain practical experience in.
              </p>
            </div>

            <div className="md:w-2/3">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <FAQItem 
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={faq.isOpen}
                    toggle={() => toggleFaq(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeMember;
