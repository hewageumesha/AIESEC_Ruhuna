import React from "react";

const BecomeMember = () => {
  return (
    <div className="font-sans">
      {/* Full-screen Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
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
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative aspect-video rounded-lg overflow-hidden max-w-xxl mx-auto">
              {/* Replace with your actual image */}
              <img
                src="/becomeMember.png"
                alt="Global talent working together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content cards */}
          <div className="md:w-1/2 space-y-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#037EF3] mb-3">
                Develop yourself
              </h2>
              <p className="text-black">
                Develop self-management ans interpersonal skills through practical leaning experiences to emerge as a well rounded individual.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-[#037EF3] mb-3">
                Learn to lead
              </h3>
              <p className="text-black">
                Get an emprowering & challenging environment where you can develop into a value-driven leader.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-[#037EF3] mb-3">
                Build your network
              </h3>
              <p className="text-black">
                Connect with people from all over the world and build your own local and international network of like-minded young people.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-[#037EF3] mb-3">
                Connect with aiesec impact
              </h3>
              <p className="text-black">
                Contribute for a better world through the programs we offer and further leadership opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
</div>
  );
};

export default BecomeMember;