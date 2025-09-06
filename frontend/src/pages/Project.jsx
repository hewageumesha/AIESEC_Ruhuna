import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/projects/");
      setProjects(res.data);
    } catch (err) {
      setErrorMsg("Failed to load projects.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Our Projects
      </h1>

      {errorMsg && (
        <div className="text-red-500 text-center mb-4">{errorMsg}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Project Photos */}
            {project.photos && project.photos.length > 0 && (
              <img
                src={project.photos[0]}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {project.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{project.year}</p>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                {project.description}
              </p>

              {/* Links */}
              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {link.length > 30 ? link.slice(0, 30) + "..." : link}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !errorMsg && (
        <p className="text-center text-gray-500 mt-8">No projects found.</p>
      )}
    </div>
  );
}
