import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Code, Database, Palette, Layers, Star, Sparkles, Zap } from 'lucide-react';

const TechiesShowcase = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const teamMembers = [
     {
      name: "M.H. Nethmi Umesha",
      role: "Full-Stack Developer",
      expertise: ["React.js", "Spring Boot", "System Integration", "Project Management"],
      contributions: [
        "Web application design",
          "Dashboard management",
          "User Management (LCP,LCVP,Team_Leader,Member)",
          "User Profile management (LCP,LCVP,Team_Leader,Member)",
          "Comments section (LCP,LCVPs)",
          "Project management (LCP,LCVPs)",
          "Session logs management"
      ],
      image: "/assets/umesha.jpeg",
      linkedin: "https://linkedin.com/in/nethmiumesha",
      github: "https://github.com/hewageumesha",
      icon: <Layers className="w-6 h-6" />
    },

       {
      name: "Ishara Palangasinghe",
      role: "Backend Developer", 
      expertise: ["Spring Boot", "MySQL", "RESTful APIs", "System Architecture"],
      contributions: [
          "Event creation (with public/private visibility)",
          "Member & guest registrations", 
          "Gallery system ",
          "Merchandise handling ",
          "Registration analytics"
            ],
      image: "/assets/ishara.jpeg",
      linkedin: "https://linkedin.com/in/ishara-palangasinghe",
      github: "https://github.com/ishara425",
      icon: <Database className="w-6 h-6" />
    },
    {
      name: "Krishanthi Christina",
      role: "Frontend Developer",
      expertise: ["React.js", "UI/UX Design", "Responsive Design"],
      contributions: [
          "Task Management",
          "Task Creation",
          "Task List views (General View) & (User-Specific View)",
          "Task Progress & Status Updates",
          "User Progress view",
          "Notifications & Alerts"
              ],
      image: "/assets/krishanthi.jpeg",
      linkedin: "https://linkedin.com/in/krishanthichristina",
      github: "https://github.com/krishanthichristina",
      icon: <Code className="w-6 h-6" />
    },
 

    {
      name: "Sajiya Roshan",
      role: "UI/UX Designer",
      expertise: ["UI/UX Design", "Interaction Design", "Design Systems"],
      contributions: [
              " Birthday management",
              "Birthday reminder system",
              "Email sender",
              "Birthday dashboard"
      ],
      image: "/assets/sajiya.jpeg",
      linkedin: "https://linkedin.com/in/sajiya-roshan",
      github: "https://github.com/sajiya-roshan",
      icon: <Palette className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Dynamic Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-gray-800 dark:via-purple-900 dark:to-black">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
          
          {/* Dynamic gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x / window.innerWidth * 100}% ${mousePosition.y / window.innerHeight * 100}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            {/* Animated icon cluster */}
            <div className="flex justify-center mb-6 space-x-4">
              <div className="animate-bounce" style={{ animationDelay: '0s' }}>
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                <Star className="w-8 h-8 text-green-400" />
              </div>
              <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>
                <Sparkles className="w-8 h-8 text-blue-300" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 animate-pulse">
              Our Development Team
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 block mt-4 animate-gradient-x">
                ⚡ Techies ⚡
              </span>
            </h1>
            
            <div 
              className="text-xl md:text-2xl text-blue-100 dark:text-gray-300 mb-8 max-w-3xl mx-auto mt-6 transform transition-transform duration-1000"
              style={{ transform: `translateY(${scrollY * -0.1}px)` }}
            >
              The technical minds behind AIESEC Ruhuna's digital transformation
            </div>
            
            {/* Animated underline */}
            <div className="relative w-32 h-1 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Floating tech icons */}
          <div className="absolute top-10 left-10 animate-spin" style={{ animationDuration: '20s' }}>
            <Code className="w-12 h-12 text-white/20" />
          </div>
          <div className="absolute top-20 right-20 animate-spin" style={{ animationDuration: '15s' }}>
            <Database className="w-10 h-10 text-white/20" />
          </div>
          <div className="absolute bottom-10 left-20 animate-spin" style={{ animationDuration: '25s' }}>
            <Layers className="w-8 h-8 text-white/20" />
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 320" className="w-full h-20">
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="text-white dark:text-gray-900"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction with animated elements */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <Sparkles className="w-6 h-6 text-purple-500 animate-bounce" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white bg-clip-text">
            Meet Our Development Team
          </h2>
          
          <p className="text-lg max-w-4xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
            Our diverse team of talented developers and designers brings together expertise in modern web technologies, 
            user experience design, and system architecture to create innovative solutions for AIESEC in University of Ruhuna.
          </p>
        </div>

        {/* Enhanced Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group relative rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
              
              <div className="relative p-8 z-10">
                {/* Profile Image and Icon */}
                <div className="flex items-center mb-6 relative">
                  <div className="relative group">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-2 -right-2 rounded-full p-2 bg-blue-600 dark:bg-blue-500 text-white group-hover:animate-spin">
                      {member.icon}
                    </div>
                    {/* Floating particles around profile */}
                    <div className="absolute -top-2 -left-2 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                    <div className="absolute -top-2 -right-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse" />
                  </div>
                  
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="font-semibold text-lg text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Animated Expertise Tags */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 cursor-pointer transform hover:scale-105"
                        style={{ animationDelay: `${skillIndex * 0.1}s` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enhanced Key Contributions */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">
                    Key Contributions
                  </h4>
                  <ul className="space-y-2">
                    {member.contributions.map((contribution, contribIndex) => (
                      <li key={contribIndex} className="flex items-start group/item">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0 group-hover/item:animate-pulse" />
                        <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-200">
                          {contribution}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enhanced Social Links */}
                <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 dark:hover:from-gray-600 dark:hover:to-gray-700 text-white rounded-lg transition-all duration-300 transform hover:scale-110 hover:-rotate-12 shadow-lg hover:shadow-xl"
                    aria-label={`${member.name}'s GitHub profile`}
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Technology Stack Section */}
        <div className="mt-20">
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Technology Stack
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Built with modern technologies and industry best practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Frontend", desc: "React.js, Ant Design, Framer Motion", icon: Code, color: "blue" },
              { title: "Backend", desc: "Spring Boot, MySQL, RESTful APIs", icon: Database, color: "green" },
              { title: "Cloud & Storage", desc: "Supabase, Cloud Storage, Security", icon: Layers, color: "purple" }
            ].map((tech, index) => (
              <div
                key={index}
                className={`group text-center p-6 rounded-xl border transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 hover:rotate-1 cursor-pointer
                  ${tech.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-blue-200' : ''}
                  ${tech.color === 'green' ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:from-green-100 hover:to-green-200' : ''}
                  ${tech.color === 'purple' ? 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-purple-200' : ''}
                `}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:animate-pulse group-hover:scale-110
                  ${tech.color === 'blue' ? 'bg-blue-600 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600' : ''}
                  ${tech.color === 'green' ? 'bg-green-600 group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-teal-600' : ''}
                  ${tech.color === 'purple' ? 'bg-purple-600 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600' : ''}
                `}>
                  <tech.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {tech.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="mt-20 text-center relative">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 relative overflow-hidden group">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-pulse">
                Experience Our Innovation
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Discover how our team's expertise translates into exceptional user experiences
                and robust system architecture.
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105 hover:-rotate-1 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-50">
                Explore Our System
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default TechiesShowcase;
