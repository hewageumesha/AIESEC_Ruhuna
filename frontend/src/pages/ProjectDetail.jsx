import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  HiCalendar, 
  HiCash, 
  HiHome, 
  HiTruck, 
  HiCake, 
  HiGlobe, 
  HiUser, 
  HiClipboardList,
  HiArrowLeft,
  HiExternalLink
} from "react-icons/hi";

export default function ProjectDetail() {
  const { type, projectName } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProject();
  }, [type, projectName]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://aiesecruhuna-production.up.railway.app/api/projects/published");

      const nameFromSlug = projectName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const foundProject = res.data.find(
        (p) =>
          p.type.toLowerCase() === type.toLowerCase() &&
          p.name.toLowerCase() === nameFromSlug.toLowerCase() &&
          p.published
      );

      if (foundProject) {
        setProject(foundProject);
        setError("");
      } else {
        setError("Project not found");
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{error || "Project not found"}</h1>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {project.logo ? (
          <img src={project.logo} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white text-6xl font-bold">
              {project.name?.charAt(0) || "P"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(`/projects/${type.toLowerCase()}`)}
              className="mb-4 inline-flex items-center text-white hover:text-gray-200 transition-colors"
            >
              <HiArrowLeft className="w-5 h-5 mr-2" />
              Back to {type.toUpperCase()} Projects
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.name}</h1>
            <div className="flex items-center flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2">
                {project.type}
              </span>
              {project.sdgFocus && (
                <>
                  <span className="mx-2 hidden md:inline">•</span>
                  <span className="mr-2 mb-2">{project.sdgFocus}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-8">
          {["overview", "opportunities", "logistics", "eligibility", "activities"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg mr-2 mb-2 transition-colors ${
                activeTab === tab
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {activeTab === "overview" && <OverviewTab project={project} />}
          {activeTab === "opportunities" && <OpportunitiesTab project={project} />}
          {activeTab === "logistics" && <LogisticsTab project={project} />}
          {activeTab === "eligibility" && <EligibilityTab project={project} />}
          {activeTab === "activities" && <ActivitiesTab project={project} />}
        </div>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ project }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Overview</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {project.overview || project.description || "No overview available."}
        </p>
      </div>

      {project.projectFee && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <HiCash className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Project Fee</h3>
          </div>
          <p className="mt-2 text-blue-700 dark:text-blue-300 font-medium">{project.projectFee}</p>
        </div>
      )}

      {project.availableSlots && project.availableSlots.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <HiCalendar className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Slots</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.availableSlots.map((slot, i) => (
              <div key={i} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-green-800 dark:text-green-200">{slot}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OpportunitiesTab({ project }) {
  const hasOpportunities = project.opportunityLinks && Object.keys(project.opportunityLinks).length > 0;
  const hasBooklets = project.projectBooklets && Object.keys(project.projectBooklets).length > 0;

  if (!hasOpportunities && !hasBooklets) {
    return (
      <div className="text-center py-8">
        <HiClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No opportunities or booklets available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {hasOpportunities && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Opportunity Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(project.opportunityLinks).map(([topic, url], i) => (
              <motion.a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="block p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">{topic}</h4>
                  <HiExternalLink className="w-5 h-5 text-blue-500" />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 truncate">{url}</p>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {hasBooklets && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Booklets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(project.projectBooklets).map(([topic, url], i) => (
              <motion.a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="block p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">{topic}</h4>
                  <HiExternalLink className="w-5 h-5 text-blue-500" />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 truncate">{url}</p>
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LogisticsTab({ project }) {
  if (!project.logistics) {
    return (
      <div className="text-center py-8">
        <HiHome className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Logistics information not available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
        <div className="flex items-center mb-3">
          <HiHome className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">Accommodation</h3>
        </div>
        <p className="text-blue-700 dark:text-blue-300">{project.logistics.accommodation || "Not specified"}</p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg">
        <div className="flex items-center mb-3">
          <HiTruck className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <h3 className="font-semibold text-green-800 dark:text-green-200">Transportation</h3>
        </div>
        <p className="text-green-700 dark:text-green-300">{project.logistics.transportation || "Not specified"}</p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-lg">
        <div className="flex items-center mb-3">
          <HiCake className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Meals</h3>
        </div>
        <p className="text-yellow-700 dark:text-yellow-300">{project.logistics.meals || "Not specified"}</p>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
        <div className="flex items-center mb-3">
          <HiGlobe className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
          <h3 className="font-semibold text-purple-800 dark:text-purple-200">Computer & Internet</h3>
        </div>
        <p className="text-purple-700 dark:text-purple-300">{project.logistics.computer || "Not specified"}</p>
      </div>
    </div>
  );
}

function EligibilityTab({ project }) {
  if (!project.eligibility) {
    return (
      <div className="text-center py-8">
        <HiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Eligibility information not available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg">
        <div className="flex items-center mb-3">
          <HiCake className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
          <h3 className="font-semibold text-red-800 dark:text-red-200">Age Requirements</h3>
        </div>
        <p className="text-red-700 dark:text-red-300">{project.eligibility.age || "Not specified"}</p>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
        <div className="flex items-center mb-3">
          <HiGlobe className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="font-semibold text-indigo-800 dark:text-indigo-200">Language Requirements</h3>
        </div>
        <p className="text-indigo-700 dark:text-indigo-300">{project.eligibility.languages || "Not specified"}</p>
      </div>

      <div className="bg-pink-50 dark:bg-pink-900/20 p-5 rounded-lg">
        <div className="flex items-center mb-3">
          <HiUser className="w-5 h-5 text-pink-600 dark:text-pink-400 mr-2" />
          <h3 className="font-semibold text-pink-800 dark:text-pink-200">Gender Eligibility</h3>
        </div>
        <p className="text-pink-700 dark:text-pink-300 capitalize">{project.eligibility.gender || "Not specified"}</p>
      </div>
    </div>
  );
}

function ActivitiesTab({ project }) {
  if (!project.projectActivities) {
    return (
      <div className="text-center py-8">
        <HiClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Activity information not available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Activities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.projectActivities.map((activity, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <span className="text-blue-600 dark:text-blue-300 text-sm font-bold">{i + 1}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{activity}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}