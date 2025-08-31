import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  TextInput,
  Textarea,
  Modal,
  Select,
  FileInput,
} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProject() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "todo",
    startDate: "",
    endDate: "",
    photos: [],
    links: [{ topic: "", url: "" }],
  });
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [showForm, setShowForm] = useState(false); // 👈 toggle Add/Edit form

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/projects/");
      setProjects(res.data);
    } catch (err) {
      setErrorMsg("Failed to fetch projects!");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    setFormData((prev) => ({ ...prev, photos: [...e.target.files] }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData((prev) => ({ ...prev, links: newLinks }));
  };

  const addLinkField = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { topic: "", url: "" }],
    }));
  };

  const removeLinkField = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, links: newLinks }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };
      const formDataObj = new FormData();

      formDataObj.append("name", payload.name);
      formDataObj.append("description", payload.description);
      formDataObj.append("status", payload.status);
      formDataObj.append("startDate", payload.startDate);
      formDataObj.append("endDate", payload.endDate);
      payload.links.forEach((link, i) => {
        formDataObj.append(`links[${i}][topic]`, link.topic);
        formDataObj.append(`links[${i}][url]`, link.url);
      });
      payload.photos.forEach((photo) => {
        formDataObj.append("photos", photo);
      });

      if (editingId) {
        await axios.put(
          `http://localhost:8080/api/projects/update/${editingId}`,
          formDataObj,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setSuccessMsg("Project updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/projects/add", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Project added successfully!");
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error saving project!");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "todo",
      startDate: "",
      endDate: "",
      photos: [],
      links: [{ topic: "", url: "" }],
    });
    setEditingId(null);
    setShowForm(false); // 👈 hide form after cancel/reset
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      photos: [],
      links: project.links || [{ topic: "", url: "" }],
    });
    setEditingId(project.id);
    setShowForm(true); // 👈 open form for editing
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/projects/delete/${deleteId}`
      );
      setSuccessMsg("Project deleted successfully!");
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setErrorMsg("Error deleting project!");
      setShowModal(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const StatusBadge = ({ status }) => {
    let color =
      "bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-600";
    if (status === "todo")
      color =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-700";
    else if (status === "inprogress")
      color =
        "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-700";
    else if (status === "completed")
      color =
        "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-700";
    else if (status === "cancelled")
      color = "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-700";

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Project Management
      </h1>

      {/* Add Project Button */}
      <div className="flex justify-start mb-6">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Project"}
        </Button>
      </div>

      {/* Add/Edit Form (hidden until button is clicked) */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
            {editingId ? "Edit Project" : "Add Project"}
          </h2>

          {/* Name + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Name
              </label>
              <TextInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <TextInput
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <TextInput
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Project description..."
            />
          </div>

          {/* Photos Upload */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Photos
            </label>
            <FileInput multiple onChange={handlePhotoChange} />
          </div>

          {/* Links */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 dark:text-gray-200">Project Links</h3>
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <TextInput
                  placeholder="Topic"
                  value={link.topic}
                  onChange={(e) =>
                    handleLinkChange(index, "topic", e.target.value)
                  }
                />
                <TextInput
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                />
                {index > 0 && (
                  <Button color="failure" onClick={() => removeLinkField(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button color="info" onClick={addLinkField}>
              + Add Link
            </Button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button color="light" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </Button>
          </div>

          {successMsg && (
            <Alert color="success" className="mt-4">
              {successMsg}
            </Alert>
          )}
          {errorMsg && (
            <Alert color="failure" className="mt-4">
              {errorMsg}
            </Alert>
          )}
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
          Projects List
        </h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((p) => (
              <React.Fragment key={p.id}>
                <tr
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => toggleExpand(p.id)}
                >
                  <td className="px-6 py-4 text-sm">{p.id}</td>
                  <td className="px-6 py-4 text-sm">{p.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {/* keep buttons in one line */}
                    <div className="flex gap-2">
                      <Button
                        color="warning"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(p);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="failure"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(p.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
                {expandedRows.includes(p.id) && (
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td colSpan="4" className="px-6 py-4">
                      <p>
                        <strong>Description:</strong> {p.description}
                      </p>
                      <p>
                        <strong>Dates:</strong> {p.startDate} - {p.endDate}
                      </p>
                      <div className="mt-2">
                        <strong>Links:</strong>
                        <ul className="list-disc ml-6">
                          {p.links?.map((l, i) => (
                            <li key={i}>
                              {l.topic}:{" "}
                              <a
                                href={l.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500"
                              >
                                {l.url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2">
                        <strong>Photos:</strong>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {p.photos?.map((photo, i) => (
                            <img
                              key={i}
                              src={photo}
                              alt="project"
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal
        show={showModal}
        size="md"
        onClose={() => setShowModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this project?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDelete}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
