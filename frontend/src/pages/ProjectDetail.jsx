import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProjectDetail() {
  const { type, projectName } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
  }, [type, projectName]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/projects/");

      const nameFromSlug = projectName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const foundProject = res.data.find(
        (p) =>
          p.type.toLowerCase() === type.toLowerCase() &&
          p.name.toLowerCase() === nameFromSlug.toLowerCase()
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || "Project not found"}</h1>
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
    <div className="min-h-screen bg-gray-50">
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
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {type.toUpperCase()} Projects
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.name}</h1>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {project.type}
              </span>
              <span className="mx-4">•</span>
              <span>{project.sdgFocus || "Sustainable Development Goals"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Overview */}
        <Section title="Overview">
          <p className="text-gray-700 leading-relaxed">
            {project.overview || project.description || "No overview available."}
          </p>
        </Section>

        {/* Opportunity Links */}
        {project.opportunities && project.opportunities.length > 0 && (
          <Section title="Opportunity Links">
            <ul className="list-disc pl-6 space-y-2">
              {project.opportunities.map((op, i) => (
                <li key={i} className="text-gray-700">
                  <a href={op.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {op.name}
                  </a>{" "}
                  – {op.details}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Project Booklet */}
        {project.booklets && project.booklets.length > 0 && (
          <Section title="Project Booklets">
            <ul className="list-disc pl-6 space-y-2">
              {project.booklets.map((bk, i) => (
                <li key={i}>
                  <a href={bk.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {bk.name}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Fee */}
        {project.projectFee && (
          <Section title="Project Fee">
            <p className="text-red-600 font-semibold">{project.projectFee}</p>
          </Section>
        )}

        {/* Available Slots */}
        {project.availableSlots && project.availableSlots.length > 0 && (
          <Section title="Available Slots">
            <ul className="list-disc pl-6 space-y-1">
              {project.availableSlots.map((slot, i) => (
                <li key={i} className="text-gray-700">{slot}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* Logistics */}
        {project.logistics && (
        <Section title="Logistics">
            {typeof project.logistics === "object" ? (
            <ul className="list-disc pl-6 space-y-1">
                {Object.entries(project.logistics).map(([key, value]) => (
                <li key={key} className="text-gray-700">
                    <span className="font-semibold capitalize">{key}:</span> {value}
                </li>
                ))}
            </ul>
            ) : (
            <p className="text-gray-700">{project.logistics}</p>
            )}
        </Section>
        )}

        {/* Eligibility */}
        {project.eligibility && (
            <Section title="Eligibility">
                {typeof project.eligibility === "object" ? (
                <ul className="list-disc pl-6 space-y-1">
                    {Object.entries(project.eligibility).map(([key, value]) => (
                    <li key={key} className="text-gray-700">
                        <span className="font-semibold capitalize">{key}:</span> {value}
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-gray-700">{project.eligibility}</p>
                )}
            </Section>
        )}
        {/* Activities */}
        {project.projectActivities && project.projectActivities.length > 0 && (
          <Section title="Activities">
            <ul className="list-disc pl-6 space-y-1">
              {project.projectActivities.map((act, i) => (
                <li key={i} className="text-gray-700">{act}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

// Section Component
function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-purple-700 mb-3">{title}</h2>
      <div className="bg-white p-6 rounded-lg shadow">{children}</div>
    </div>
  );
}
