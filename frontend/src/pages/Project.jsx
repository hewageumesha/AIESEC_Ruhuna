import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { type } = useParams();

  // Set filter based on URL parameter
  const filter = type || "all";
  const [activeArea, setActiveArea] = useState(filter);

  useEffect(() => {
    fetchProjects();
    setActiveArea(filter);
  }, [filter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/projects/");
      setProjects(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setActiveArea(newFilter);
    if (newFilter === "all") {
      navigate("/projects");
    } else {
      navigate(`/projects/${newFilter.toLowerCase()}`);
    }
  };

  const handleProjectClick = (project) => {
    // Create URL-friendly slug from project name
    const slug = project.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    navigate(`/projects/${project.type.toLowerCase()}/${slug}`);
  };

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(project => project.type.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Projects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our various initiatives and find the perfect opportunity to make a difference.
          </p>
        </div>

        {/* Filter buttons - Updated style */}
        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#037EF3] to-[#0CB9C1] hover:opacity-90 transition
              ${activeArea === "all" ? '' : 'opacity-50'}`}
          >
            All Projects
          </button>
          <button
            onClick={() => handleFilterChange("iGV")}
            className={`px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#037EF3] to-[#0CB9C1] hover:opacity-90 transition
              ${activeArea === "iGV" ? '' : 'opacity-50'}`}
          >
            iGV Projects
          </button>
          <button
            onClick={() => handleFilterChange("iGTa")}
            className={`px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#037EF3] to-[#0CB9C1] hover:opacity-90 transition
              ${activeArea === "iGTa" ? '' : 'opacity-50'}`}
          >
            iGTa Projects
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg max-w-2xl mx-auto">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No projects found. {filter !== "all" && `Try changing the filter.`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {project.logo ? (
          <img
            src={project.logo}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl font-bold">
            {project.name?.charAt(0) || "P"}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {project.name}
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {project.type}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {project.overview || project.description || "No description available."}
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Click to learn more →</span>
        </div>
      </div>
    </motion.div>
  );
}