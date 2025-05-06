import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import PhotoSlider from "../components/PhotoSlider";

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

  return (
    <div>
      <section className="">
      {/* Photo Slider */}
      <div>
        <PhotoSlider photos={photoCollection} />
      </div>
      </section>

      {/* Our Programs Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 ">
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
        <section className="max-w-6xl mx-auto px-4 py-12 ">
        {/* AIESEC Membership Section with Image */}
        <div className="flex flex-col md:flex-row items-center gap-8 rounded-lg ">
          {/* Image Column */}
          <div className="md:w-1/2">
            <img 
              src="/aiesec-team.webp" 
              alt="AIESEC team working together"
              className="w- h-auto rounded-lg object-cover shadow-sm"
            />
          </div>
          
          {/* Text Content Column */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Join AIESEC and Create these experiences yourself</h2>
            <p className="text-gray-600 mb-6 text-2xl dark:text-gray-300">
              Join one of our local chapters and develop yourself through practical experiences in the world's largest youth-led organization.
            </p>
            
            {/* "Become a member" Button */}
            <Link 
              to="/become-member" 
              className="inline-block px-8 py-3 bg-[#037EF3] text-white rounded-lg hover:bg-[#0366d6] transition-colors text-lg font-medium"
            >
              Become a member
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
