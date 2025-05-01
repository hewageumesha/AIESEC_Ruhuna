import React from "react";

const GlobalVolunteer = () => {
  return (
    <div className="font-sans">
      {/* Full-screen Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="/volunteer.webp"
            alt="Internship background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        </div>
        
        {/* Hero Content - Left Aligned */}
        <div className="relative z-20 h-full flex flex-col justify-center p-6 md:p-12 text-white">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Volunteer with AIESEC</h1>
            <p className="text-xl md:text-2xl mb-8">
              Develop your leadership through a volunteering project contributing to the Sustainable Development Goals
            </p>
            <button 
              className="text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#F85A40', '&:hover': { backgroundColor: '#0aa8b0' } }}
            >
              Become an volunteer
            </button>
          </div>
        </div>
      </section>

        {/* Global Client Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative aspect-video rounded-lg overflow-hidden max-w-xxl mx-auto">
              {/* Replace with your actual image */}
              <img
                src="/globalVolunteer.png"
                alt="Global talent working together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content cards */}
          <div className="md:w-1/2 space-y-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#F85A40] mb-3">
                Experience new cultures
              </h2>
              <p className="text-black">
                There's nothing like being in a foreign Country/Territory, living and volunteering with people from all around the world, being exposed to different points of view and ways of living.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-[#F85A40] mb-3">
                Make in impact 
              </h3>
              <p className="text-black">
                On a Global Volunteer project with AIESEC, you work towards tackling the issues you're most passionate about with one of the Sustainable Development Goals of the United Nations.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-[#F85A40] mb-3">
                Challenge yourself
              </h3>
              <p className="text-black">
                Our projects are packed with opportunities to try something new, push you out of your comfort zone and discover the best version of yourself - becaause growth happens beyond your comfort zone!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
</div>
  );
};

export default GlobalVolunteer;