import React from 'react'

const ImageCard = ({ href, src, alt, label }) => {
  return (
    <a
      href={href}
      className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
    >
      <img
        src={src}
        loading="lazy"
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
      <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">
        {label}
      </span>
    </a>
  );
};

const ResponsiveImageGallery = () => {
  const galleryItems = [
    {
      id: 1,
      href: "#",
      src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&q=75&fit=crop&w=600",
      alt: "Photo by Minh Pham",
      label: "VR",
      colSpan: "",
    },
    {
      id: 2,
      href: "#",
      src: "https://images.unsplash.com/photo-1542759564-7ccbb6ac450a?auto=format&q=75&fit=crop&w=1000",
      alt: "Photo by Magicle",
      label: "Tech",
      colSpan: "md:col-span-2",
    },
    {
      id: 3,
      href: "#",
      src: "https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=1000",
      alt: "Photo by Martin Sanchez",
      label: "Dev",
      colSpan: "md:col-span-2",
    },
    {
      id: 4,
      href: "#",
      src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&q=75&fit=crop&w=600",
      alt: "Photo by Lorenzo Herrera",
      label: "Retro",
      colSpan: "",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-12">
            <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">
              Gallery
            </h2>

            <p className="hidden max-w-screen-m text-gray-500 dark:text-gray-300 md:block">
              Discover captivating moments frozen in time. Each image tells a unique story - from cutting-edge technology to timeless retro vibes. Our visual collection inspires creativity and sparks imagination.
            </p>
          </div>

          <a
            href="#"
            className="inline-block rounded-lg border bg-white dark:bg-gray-700 dark:border-none px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-200 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base"
          >
            More
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
          {galleryItems.map((item) => (
            <div key={item.id} className={item.colSpan}>
              <ImageCard
                href={item.href}
                src={item.src}
                alt={item.alt}
                label={item.label}
              />
            </div>
          ))}
        </div>
      </div>
import React, { useState } from 'react';
import { Filter, Calendar, Users, Award, Star } from 'lucide-react';

const AiesecGallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    // ... (same event data as before)
  ];

  const filterCategories = [
    { id: 'all', label: 'All Events', icon: Filter },
    { id: 'large-scale', label: 'Large Scale Events', icon: Star },
    { id: 'lcm', label: 'LCM Events', icon: Users },
    { id: 'induction', label: 'Induction Events', icon: Award },
  ];

  const filteredEvents = activeFilter === 'all'
    ? events
    : events.filter(event => event.category === activeFilter);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'large-scale': return 'from-blue-500 to-blue-700';
      case 'lcm': return 'from-orange-500 to-orange-700';
      case 'induction': return 'from-green-500 to-green-700';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const getEventIcon = (category) => {
    switch (category) {
      case 'large-scale': return <Star className="w-6 h-6" />;
      case 'lcm': return <Users className="w-6 h-6" />;
      case 'induction': return <Award className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-gradient-to-r from-blue-600 to-light-blue-500 text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">AIESEC Ruhuna</h1>
        <p className="text-xl text-blue-100 mb-2">Event Gallery</p>
        <p className="text-blue-200">Showcasing our memorable moments and achievements</p>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterCategories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-blue-50 shadow-md'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 transform group-hover:scale-105">
                <div className={`bg-gradient-to-r ${getCategoryColor(event.category)} p-4 text-white`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getEventIcon(event.category)}
                    <h3 className="font-bold text-lg">{event.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{event.participants} participants</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {event.images.slice(0, 4).map(image => (
                      <div
                        key={image.id}
                        className="aspect-square bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg flex items-center justify-center text-xs text-gray-600 hover:from-blue-200 hover:to-orange-200 cursor-pointer transition-all"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <span className="text-center px-2">{image.caption}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-orange-600 transition"
                  >
                    View Gallery ({event.images.length} photos)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </main>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className={`bg-gradient-to-r ${getCategoryColor(selectedEvent.category)} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getEventIcon(selectedEvent.category)}
                    <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedEvent.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedEvent.participants} participants
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  &times;
                </button>
              </div>
              <p className="mt-4 text-blue-100">{selectedEvent.description}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedEvent.images.map(image => (
                  <div
                    key={image.id}
                    className="aspect-square bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg flex items-center justify-center text-sm text-gray-600 hover:from-blue-200 hover:to-orange-200 transition p-4"
                  >
                    <span className="text-center">{image.caption}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImageGallery;
export default AiesecGallery;
