import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button, TextInput, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashManageDepartment() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/departments");
      setDepartments(res.data);
    } catch (err) {
      setErrorMsg("Failed to fetch departments!");
    }
  };

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/departments/${editingId}`, formData);
        setSuccessMsg("Department updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/departments", formData);
        setSuccessMsg("Department added successfully!");
      }
      setFormData({ name: "" });
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      setErrorMsg("Error saving department!");
    }
  };

  const handleEdit = (dept) => {
    setFormData({ name: dept.name });
    setEditingId(dept.id);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/departments/${deleteId}`);
      setSuccessMsg("Department deleted successfully!");
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      setErrorMsg("Error deleting department!");
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Department Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[rgb(16,23,42)]">
        <h2 className="text-lg font-medium mb-4 dark:text-gray-50">
          {editingId ? "Edit Department" : "Add Department"}
        </h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1 dark:text-gray-200">
            Department Name
          </label>
          <TextInput
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button color="light" onClick={() => { setFormData({ name: "" }); setEditingId(null); }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingId ? "Update" : "Add"}
          </Button>
        </div>

        {successMsg && <Alert color="success" className="mt-4">{successMsg}</Alert>}
        {errorMsg && <Alert color="failure" className="mt-4">{errorMsg}</Alert>}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-[rgb(16,23,42)]">
        <h2 className="text-lg font-medium mb-4 dark:text-gray-50">Departments List</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {departments.map((dept) => (
            <li key={dept.id} className="py-4 flex justify-between items-center">
              <span className="dark:text-gray-300">{dept.name}</span>
              <div className="space-x-2">
                <Button color="warning" onClick={() => handleEdit(dept)}>Edit</Button>
                <Button color="failure" onClick={() => openDeleteModal(dept.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete confirmation modal */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this department?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
