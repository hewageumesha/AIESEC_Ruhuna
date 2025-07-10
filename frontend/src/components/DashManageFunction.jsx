import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button, TextInput, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashManageFunction() {
  const [functions, setFunctions] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchFunctions();
  }, []);

  const fetchFunctions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/functions/");
      setFunctions(res.data);
    } catch (err) {
      setErrorMsg("Failed to fetch functions!");
    }
  };

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/functions/update/${editingId}`, formData);
        setSuccessMsg("Function updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/functions/add", formData);
        setSuccessMsg("Function added successfully!");
      }
      setFormData({ name: "" });
      setEditingId(null);
      fetchFunctions();
    } catch (err) {
      setErrorMsg("Error saving function!");
    }
  };

  const handleEdit = (func) => {
    setFormData({ name: func.name });
    setEditingId(func.id);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/functions/delete/${deleteId}`);
      setSuccessMsg("Function deleted successfully!");
      setShowModal(false);
      fetchFunctions();
    } catch (err) {
      setErrorMsg("Error deleting function!");
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Function Management</h1>

      {/* Add/Edit form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[rgb(26,35,58)]">
        <h2 className="text-lg font-medium mb-4 dark:text-gray-50">
          {editingId ? "Edit Function" : "Add Function"}
        </h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1 dark:text-gray-200">
            Function Name
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

      {/* Functions Table */}
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-[rgb(26,35,58)]">
        <h2 className="text-lg font-medium mb-4 dark:text-gray-50">Functions List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-[rgb(26,35,58)] dark:divide-gray-700">
              {functions.map((func) => (
                <tr key={func.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{func.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{func.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button color="warning" onClick={() => handleEdit(func)}>Edit</Button>
                      <Button color="failure" onClick={() => openDeleteModal(func.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this function?
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
