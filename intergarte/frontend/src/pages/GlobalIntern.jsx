import React from "react";

const GlobalIntern = () => {
  return (
    <div className="font-sans">
      {/* Full-screen Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
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
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative aspect-video rounded-lg overflow-hidden max-w-xxl mx-auto">
              {/* Replace with your actual image */}
              <img
                src="/globalTalent.png"
                alt="Global talent working together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content cards */}
          <div className="md:w-1/2 space-y-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#0CB9C1] mb-3">
                Get the multi-cultural work experience
              </h2>
              <p className="text-black">
                You can gain experience in new cross-cultural settings, equip yourself with new skills and add value to your workplace.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-[#0CB9C1] mb-3">
                Find the industry for you
              </h3>
              <p className="text-black">
                Our pool of opportunities are growing across fields - we're sure you'll find one best fitting your background and experiences.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-[#0CB9C1] mb-3">
                Gain a professional edge
              </h3>
              <p className="text-black">
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

export default GlobalIntern;