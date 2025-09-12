import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const developers = [
  { name: 'Krishanthi Christina', role: 'Frontend Developer', tagline: 'Crafting pixel-perfect UIs', email: 'krishanthi@example.com', photo: "", linkedin: 'https://www.linkedin.com/in/krishanthi/', github: 'https://github.com/krishanthi' },
  { name: 'Ishara Palangasighe', role: 'Backend Developer', tagline: 'Building strong digital backbones', email: 'nadith@example.com', photo: "", linkedin: 'https://www.linkedin.com/in/nadith/', github: 'https://github.com/nadith' },
  { name: 'M.H.Nethmi Umesha', role: 'Fullstack Developer', tagline: 'Bridging front & back seamlessly', email: 'n.u.m.hewage@gmail.com', photo: "/asset/umesha.jpeg", linkedin: 'http://www.linkedin.com/in/nethmiumesha', github: 'https://github.com/hewageumesha' },
  { name: 'Sajeeya Roshan', role: 'UI/UX Designer', tagline: 'Designing experiences with heart', email: 'dilshan@example.com', photo: "", linkedin: 'https://www.linkedin.com/in/dilshan/', github: 'https://github.com/dilshan' },
];

// fallback avatar with initials
const getInitials = (name) => {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
};

export default function Developers() {
  return (
    <div className="relative p-4 md:p-12 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background animated blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

      <motion.div
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, type: "spring" }}
  className="text-center mb-16"
>
  <h1 className="text-5xl font-extrabold tracking-tight">
    <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
      Meet the Developers
    </span>
  </h1>
  <div className="mt-4 flex justify-center">
    <span className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-lg"></span>
  </div>
  <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
    The minds behind the magic ✨
  </p>
</motion.div>


      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 justify-items-center relative z-10">
        {developers.map((dev, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: index * 0.25,
              type: "spring",
              stiffness: 80,
              damping: 12,
            }}
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-400 transition-all duration-500 w-72 md:w-80"
          >
            {dev.photo ? (
              <img
                src={dev.photo}
                alt={dev.name}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400">
                {getInitials(dev.name)}
              </div>
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white px-4 transition-opacity duration-500">
              <h2 className="text-2xl font-bold mb-1">{dev.name}</h2>
              <p className="text-sm italic mb-2">{dev.role}</p>
              <p className="text-xs mb-4">{dev.tagline}</p>
              <p className="mb-4">
                <a href={`mailto:${dev.email}`} className="underline hover:text-red-400 transition">
                  {dev.email}
                </a>
              </p>
              <div className="flex gap-6 text-2xl">
                {[ 
                  { icon: <FaLinkedin />, link: dev.linkedin, color: "hover:text-blue-400" },
                  { icon: <FaGithub />, link: dev.github, color: "hover:text-gray-300" },
                  { icon: <FaEnvelope />, link: `mailto:${dev.email}`, color: "hover:text-red-400" },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ${social.color}`}
                    transition={{ delay: i * 0.15 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
