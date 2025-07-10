import React, { useState, useEffect } from "react";
import { Alert, Button, TextInput, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";

export default function DashManageMember() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    aiesecEmail: "",
    birthday: "",
    gender: "",
    joinedDate: "",
    role: "",
    department: "",
    function: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const roleOptions = ["lcp", "lcvp", "team_leader", "member"];
  const departmentOptions = [
    "Finance", "Marketing", "IT", "HR", "Sales",
    "Product", "Operations", "OGX", "ICX",
    "BD", "TM", "PM", "ER", "IM"
  ];
  const functionOptions = [
    "Finance Analyst", "Marketing Executive", "Designer",
    "Developer", "Recruiter", "Sales Executive",
    "Product Owner", "Operations Associate",
    "OGX Associate", "ICX Associate"
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/members");
      setMembers(res.data);
    } catch (err) {
      setErrorMsg("Failed to fetch members!");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateAiesecEmail = (email) => {
    return email.endsWith("@aiesec.net");
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!validateAiesecEmail(formData.aiesecEmail)) {
      setErrorMsg("AIESEC email must end with @aiesec.net");
      return;
    }
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/members/${editingId}`, formData);
        setSuccessMsg("Member updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/members", formData);
        setSuccessMsg("Member added successfully!");
      }
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        aiesecEmail: "",
        birthday: "",
        gender: "",
        joinedDate: "",
        role: "",
        department: "",
        function: "",
      });
      setEditingId(null);
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      setErrorMsg("Error saving member!");
    }
  };

  const handleEdit = (member) => {
    setFormData(member);
    setEditingId(member.id);
    setShowForm(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/members/${deleteId}`);
      setSuccessMsg("Member deleted successfully!");
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      setErrorMsg("Error deleting member!");
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Member Management</h1>

      <Button onClick={() => {
        setShowForm(!showForm);
        if (!showForm) {
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            aiesecEmail: "",
            birthday: "",
            gender: "",
            joinedDate: "",
            role: "",
            department: "",
            function: "",
          });
          setEditingId(null);
        }
      }}>
        {showForm ? "Cancel" : "Add Member"}
      </Button>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 dark:bg-[rgb(26,35,58)]">
          <h2 className="text-lg font-medium mb-4 dark:text-gray-50">
            {editingId ? "Edit Member" : "Add Member"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">First Name</label>
              <TextInput name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Last Name</label>
              <TextInput name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-200">Email</label>
            <TextInput name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-200">AIESEC Email</label>
            <TextInput name="aiesecEmail" value={formData.aiesecEmail} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Birthday</label>
              <TextInput type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Gender</label>
              <TextInput name="gender" value={formData.gender} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Joined Date</label>
              <TextInput type="date" name="joinedDate" value={formData.joinedDate} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 text-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Role</option>
                {roleOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 text-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Department</option>
                {departmentOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Function</label>
              <select
                name="function"
                value={formData.function}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 text-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Function</option>
                {functionOptions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button color="light" onClick={() => { setShowForm(false); setEditingId(null); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </Button>
          </div>

          {successMsg && <Alert color="success" className="mt-4">{successMsg}</Alert>}
          {errorMsg && <Alert color="failure" className="mt-4">{errorMsg}</Alert>}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mt-6 dark:bg-[rgb(26,35,58)]">
        <h2 className="text-lg font-medium mb-4 dark:text-gray-50">Members List</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {members.map((member) => (
            <li key={member.id} className="py-4 flex justify-between items-center">
              <div className="dark:text-gray-300">
                <p className="font-medium">{member.firstName} {member.lastName} ({member.role})</p>
                <p className="text-sm">{member.email}</p>
              </div>
              <div className="space-x-2">
                <Button color="warning" onClick={() => handleEdit(member)}>Edit</Button>
                <Button color="failure" onClick={() => openDeleteModal(member.id)}>Delete</Button>
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
              Are you sure you want to delete this member?
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
