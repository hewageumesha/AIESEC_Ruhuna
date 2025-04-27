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
    { 
      id: 1, 
      url: '/image1.jpg', 
      alt: 'Aiesec in Ruhuna' 
    },
    { 
      id: 2, 
      url: '/image2.jpg', 
      alt: 'Aiesec in Ruhuna' 
    },
    { 
      id: 3, 
      url: '/image3.jpg', 
      alt: 'Aiesec in Ruhuna' 
    },
    { 
      id: 4, 
      url: '/image4.jpg', 
      alt: 'Aiesec in Ruhuna' 
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/event/getEvents');
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await res.json();
        const currentDate = new Date();
        
        // Filter recent and upcoming events
        const filteredEvents = data.events.filter(event => new Date(event.date) <= currentDate);
        const filteredUpcomingEvents = data.events.filter(event => new Date(event.date) > currentDate);
        
        setEvents(filteredEvents); // Recent events
        setUpcomingEvents(filteredUpcomingEvents); // Upcoming events
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <div>
        <PhotoSlider photos={photoCollection}/>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {loading ? (
          <div className="text-center">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <>
            {/* Recent Events */}
            {events && events.length > 0 && (
              <div className='flex flex-col gap-6'>
                <h2 className='text-2xl font-semibold text-center'>Recent Events</h2>
                <div className='flex flex-wrap gap-4'>
                  {events.map((event) => (
                    <PostCard key={event._id} event={event} />
                  ))}
                </div>
                <Link
                  to={'/search'}
                  className='text-lg text-teal-500 hover:underline text-center'
                >
                  View all events
                </Link>
              </div>
            )}

            {/* Upcoming Events */}
            {upcomingEvents && upcomingEvents.length > 0 && (
              <div className='flex flex-col gap-6'>
                <h2 className='text-2xl font-semibold text-center'>Upcoming Events</h2>
                <div className='flex flex-wrap gap-4'>
                  {upcomingEvents.map((event) => (
                    <PostCard key={event._id} event={event} />
                  ))}
                </div>
                <Link
                  to={'/search'}
                  className='text-lg text-teal-500 hover:underline text-center'
                >
                  View all events
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
