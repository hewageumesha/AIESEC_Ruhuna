import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import PhotoSlider from "../components/PhotoSlider";
import React from 'react';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const photoCollection = [
    { id: 1, url: '/image1.jpg', alt: 'Aiesec in Ruhuna' },
    { id: 2, url: '/image2.jpg', alt: 'Aiesec in Ruhuna' },
    { id: 3, url: '/image3.jpg', alt: 'Aiesec in Ruhuna' },
    { id: 4, url: '/image4.jpg', alt: 'Aiesec in Ruhuna' },
  ];

  /*
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/event/getEvents');
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await res.json();
        const currentDate = new Date();
        
        const filteredEvents = data.events.filter(event => new Date(event.date) <= currentDate);
        const filteredUpcomingEvents = data.events.filter(event => new Date(event.date) > currentDate);
        
        setEvents(filteredEvents);
        setUpcomingEvents(filteredUpcomingEvents);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  */

  const programs = [
    {
      title: "Explore teaching",
      path: "/global-teacher",
      img: "/exploreTeaching.png",
      bgColor: "bg-orange-500",
    },
    {
      title: "Explore interning",
      path: "/global-intern",
      img: "/exploreInterning.jpg",
      bgColor: "bg-cyan-500",
    },
    {
      title: "Explore volunteering",
      path: "/global-volunteer",
      img: "/exploreVolunteering.jpg",
      bgColor: "bg-red-500",
    },
  ];

  const testimonials = [
    {
      id: 1,
      quote: "Volunteering for the global classroom project in Vietnam was a life-changing experience that allowed me to connect with students across cultures and contribute meaningfully to their education.",
      author: "Manodya Jayathunga",
      location: "FHCMC - Vietnam",
      program: "Global Classroom",
      photo: "/testimonial/testimonial1.jpg"
    },
    {
      id: 2,
      quote: "Life isn’t counted in years, but in the places you’ve explored, the people you’ve met, and the influence you leave behind.",
      author: "Dilkahashi Omal Randilina",
      location: "Navi Mumbai - India",
      program: "On The Map",
      photo: "/testimonial/testimonial2.jpg"
    },
    {
      id: 3,
      quote: "My time volunteering in India was filled with new challenges and meaningful experiences. It taught me how to adjust, stay strong, and build important skills that will help me in the future.",
      author: "Navidi Omasha",
      location: "Dehradun - India",
      program: "On The Map",
      photo: "/testimonial/testimonial3.jpg"
    }
  ];

  const customerLogos = [
    { id: 1, logo: "/logos/pwc.png", alt: "PwC Global Partnership" },
    { id: 2, logo: "/logos/nexans.png", alt: "Nexans" },
    { id: 3, logo: "/logos/International SOS.png", alt: "International SOS" },
    { id: 4, logo: "/logos/Husqvarna Group.png", alt: "Husqvarna Group" },
    { id: 5, logo: "/logos/ALFA LAVAL.png", alt: "ALFA LAVAL" },
    { id: 6, logo: "/logos/Infosys Limited.jpeg", alt: "Infosys Limited" },
    { id: 7, logo: "/logos/EATON.png", alt: "EATON" },
    { id: 8, logo: "/logos/DHL Group.png", alt: "DHL Group" },
    { id: 9, logo: "/logos/terrawind.jpeg", alt: "Terrawind Global Protection" },
    { id: 10, logo: "/logos/Schneider Electric.jpeg", alt: "Schneider Electric - Global Partnership" },
    { id: 11, logo: "/logos/Henkel.png", alt: "Henkel AG & Co. KGaA" },
    { id: 12, logo: "/logos/HKTE.png", alt: "Hong Kong Talent Engage" },
    { id: 13, logo: "/logos/Electrolux.png", alt: "AB Electrolux" },
    { id: 14, logo: "/logos/Tata.png", alt: "Tata Consultancy Services Ltd." },
    { id: 15, logo: "/logos/Electrolux Professional Group.png", alt: "Electrolux Professional Group" },
  ];

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOpen: false
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Set intake period (July 1 to August 1)
      let intakeStart = new Date(currentYear, 6, 1); // July is month 6 (0-indexed)
      let intakeEnd = new Date(currentYear, 7, 1); // August is month 7
      
      // If we're past this year's intake, set for next year
      if (now > intakeEnd) {
        intakeStart = new Date(currentYear + 1, 6, 1);
        intakeEnd = new Date(currentYear + 1, 7, 1);
      }

      const isIntakeOpen = now >= intakeStart && now <= intakeEnd;
      
      if (isIntakeOpen) {
        // Calculate time until intake closes
        const diff = intakeEnd - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown({
          days,
          hours,
          minutes,
          seconds,
          isOpen: true
        });
      } else {
        // Calculate time until next intake opens
        const diff = intakeStart - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown({
          days,
          hours,
          minutes,
          seconds,
          isOpen: false
        });
      }
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Photo Slider */}
      <section className="">
        <div>
          <PhotoSlider photos={photoCollection} />
        </div>
      </section>

      {/* Our Programs Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold mb-4 dark:text-white">Our Programs</h1>
          <p className="text-2xl mb-8 text-gray-500 dark:text-gray-300">
            We aim to develop leadership qualities and capabilities in young people with these programs
          </p>

          {/* Program Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <Link
                to={program.path}
                key={index}
                className="group relative rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={program.img}
                  alt={program.title}
                  className="w-full h-64 object-cover"
                />
                <div
                  className={`absolute bottom-0 left-0 right-0 text-white text-xl font-semibold py-4 text-center transition-all duration-500 ${program.bgColor} group-hover:bg-opacity-90`}
                >
                  {program.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center">
          <div className="hidden md:block flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          {/* Mobile icon (hidden on desktop) */}
          <svg 
            className="w-6 h-6 text-gray-400 md:hidden mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
          </svg>
          
          <span className="px-2 md:px-4 text-2xl md:text-4xl font-medium text-gray-400 dark:text-gray-300 whitespace-nowrap">
            Looking for something different?
          </span>
          
          {/* Mobile icon (hidden on desktop) */}
          <svg 
            className="w-6 h-6 text-gray-400 md:hidden ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
          
          {/* Desktop dashes */}
          <div className="hidden md:block flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 ">
          {/* AIESEC Membership Section with Image */}
          <div className="flex flex-col md:flex-row items-center rounded-lg gap-4">
            {/* Image Column */}
            <div className="md:w-1/2">
              <img 
                src="/aiesec-team.jpg" 
                alt="AIESEC team working together"
                className="w-75 h-auto rounded-lg object-cover shadow-sm"
              />
            </div>
            
            {/* Text Content Column */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl font-bold mb-4 dark:text-white">Join AIESEC and Create these experiences yourself</h2>
              <p className="text-gray-600 mb-6 text-2xl dark:text-gray-300">
                Join one of our local chapters and develop yourself through practical experiences in the world's largest youth-led organization.
              </p>
              
              {/* Become a member */}
              <div className="w-full max-w-md mx-auto p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-white">
                  {countdown.isOpen ? '🎉 Membership Intake Open!' : '⏳ Next Intake Countdown'}
                </h3>
                
                <div className="flex justify-center gap-2 mb-4">
                  {/* Days */}
                  <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg min-w-[70px]">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-200">{countdown.days}</span>
                    <span className="text-xs text-blue-500 dark:text-blue-300">DAYS</span>
                  </div>
                  
                  {/* Hours */}
                  <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg min-w-[70px]">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-200">{countdown.hours}</span>
                    <span className="text-xs text-blue-500 dark:text-blue-300">HOURS</span>
                  </div>
                  
                  {/* Minutes */}
                  <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg min-w-[70px]">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-200">{countdown.minutes}</span>
                    <span className="text-xs text-blue-500 dark:text-blue-300">MINUTES</span>
                  </div>
                  
                  {/* Seconds */}
                  <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg min-w-[70px]">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-200">{countdown.seconds}</span>
                    <span className="text-xs text-blue-500 dark:text-blue-300">SECONDS</span>
                  </div>
                </div>
                
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  {countdown.isOpen 
                    ? 'Applications close on August 1st - Apply now! If you want to be a part of the next intake, please contact us.'
                    : 'Next application window opens July 1st'}
                </p>
              </div>
            </div>
          </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Voices of Our Members</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear directly from those who've experienced AIESEC's transformative programs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* Enhanced Profile Photo Container */}
                <div className="relative mb-4 group">
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-700 relative z-10">
                    <img 
                      src={testimonial.photo} 
                      alt={testimonial.author}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#037EF3] to-[#00c6ff] opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 rounded-full border-2 border-[#037EF3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Testimonial Content */}
                <div className="flex-grow flex flex-col">
                  <svg 
                    className="w-6 h-6 text-gray-400 dark:text-gray-500 mb-3 mx-auto" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  
                  <blockquote className="text-gray-700 dark:text-gray-300 italic mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="mt-auto">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{testimonial.author}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.program} · {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Our Valued Partners
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* National Partners Section - Left Side */}
            <div className="md:w-1/2">
              <div className=""> 
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8 text-center">
                  Our National Partners
                </h3>
                <div className="flex justify-center items-center h-full dark:bg-[rgb(16,23,42)]">
                  <img
                    src="/logos/all-national-partners-logo.png"
                    alt="Our National Partners"
                    className="h-45 object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Previous Partners Section - Right Side */}
            <div className="md:w-1/2">
              <div className="">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-10 text-center">
                  Our Previous Partners
                </h3>
                <div className="py-6 flex justify-center items-center h-full dark:bg-[rgb(16,23,42)]">
                  <img
                    src="/logos/all-previous-partners-logo.png"
                    alt="Our Previous Partners"
                    className="h-100 object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
