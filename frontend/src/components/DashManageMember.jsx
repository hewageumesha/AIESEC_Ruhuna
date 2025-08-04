import React, { useState, useEffect } from "react";
import { Alert, Button, TextInput, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import { useSelector } from "react-redux";

export default function DashManageMember() {
  const { currentUser } = useSelector((state) => state.user);
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
    teamLeaderAiesecEmail: "",
    function: "",
  });
  const [editing, setEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [functionOptions, setFunctionOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchMembers(), fetchRoles(), fetchFunctions()]);
    } catch (error) {
      setErrorMsg("Failed to fetch initial data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:8080/api/roles/all");
    setRoleOptions(res.data);
  };

  const fetchFunctions = async () => {
    const res = await axios.get("http://localhost:8080/api/functions/");
    setFunctionOptions(res.data);
  };

  const fetchMembers = async () => {
    const res = await axios.get("http://localhost:8080/api/users/getall");
    setMembers(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.aiesecEmail.endsWith("@aiesec.net")) {
      setErrorMsg("AIESEC email must end with @aiesec.net");
      return false;
    }
    if (!formData.firstName || !formData.lastName) {
      setErrorMsg("First name and last name are required");
      return false;
    }
    if (!formData.role) {
      setErrorMsg("Role is required");
      return false;
    }
    if (!formData.function) {
      setErrorMsg("Function is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editing) {
        await axios.put(
          `http://localhost:8080/api/users/update/${formData.aiesecEmail}`,
          formData,
          { withCredentials: true }
        );
        setSuccessMsg("Member updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8080/api/users/add",
          formData,
          { withCredentials: true }
        );
        setSuccessMsg("Member added successfully!");
      }
      resetForm();
      await fetchMembers();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error saving member");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      aiesecEmail: "",
      birthday: "",
      gender: "",
      joinedDate: "",
      role: "",
      teamLeaderAiesecEmail: getDefaultTeamLeader(),
      function: getDefaultFunction(),
    });
    setEditing(false);
    setShowForm(false);
    setErrorMsg("");
  };

  const handleAddMemberClick = () => {
    setShowForm(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      aiesecEmail: "",
      birthday: "",
      gender: "",
      joinedDate: "",
      role: currentUser.role === "Team_Leader" ? "Member" : "",
      teamLeaderAiesecEmail: getDefaultTeamLeader(),
      function: getDefaultFunction(),
    });
    setEditing(false);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const getDefaultTeamLeader = () => {
    if (!currentUser) return "";
    if (currentUser.role === "LCVP" || currentUser.role === "Team_Leader") {
      return currentUser.aiesecEmail;
    }
    return "";
  };

  const getDefaultFunction = () => {
    if (!currentUser) return "";
    return currentUser.function?.id?.toString() || "";
  };

  const handleEdit = (member) => {
    if (!hasEditPermission(member)) {
      setErrorMsg("You don't have permission to edit this member");
      return;
    }
    setFormData(member);
    setEditing(true);
    setShowForm(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const hasEditPermission = (member) => {
    if (!currentUser) return false;
    
    if (currentUser.role === "LCP") return true;
    
    if (currentUser.role === "LCVP") {
      return (
        (member.role === "Team_Leader" || member.role === "Member") && 
        member.function?.id === currentUser.function?.id
      );
    }
    
    if (currentUser.role === "Team_Leader") {
      return (
        member.role === "Member" && 
        member.function?.id === currentUser.function?.id &&
        member.teamLeaderAiesecEmail === currentUser.aiesecEmail
      );
    }
    
    return false;
  };

  const hasDeletePermission = (member) => {
    return hasEditPermission(member);
  };

  const openDeleteModal = (member) => {
    if (!hasDeletePermission(member)) {
      setErrorMsg("You don't have permission to delete this member");
      return;
    }
    setDeleteId(member.aiesecEmail);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:8080/api/users/delete/${deleteId}`,
        { withCredentials: true }
      );
      setSuccessMsg("Member deleted successfully!");
      setShowModal(false);
      await fetchMembers();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error deleting member");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMembers = () => {
    if (!currentUser) return [];
    
    if (currentUser.role === "LCP") return members;
    
    if (currentUser.role === "LCVP") {
      return members.filter(member => 
        (member.role === "Team_Leader" || member.role === "Member") && 
        member.function?.id === currentUser.function?.id
      );
    }
    
    if (currentUser.role === "Team_Leader") {
      return members.filter(member => 
        member.role === "Member" && 
        member.function?.id === currentUser.function?.id &&
        member.teamLeaderAiesecEmail === currentUser.aiesecEmail
      );
    }
    
    return [];
  };

  const getAvailableRoles = () => {
    if (!currentUser) return [];
    
    if (currentUser.role === "LCP") return roleOptions;
    
    if (currentUser.role === "LCVP") {
      return roleOptions.filter(role => role === "Team_Leader" || role === "Member");
    }
    
    if (currentUser.role === "Team_Leader") {
      return roleOptions.filter(role => role === "Member");
    }
    
    return [];
  };

  const getAvailableFunctions = () => {
    if (!currentUser) return [];
    
    if (currentUser.role === "LCP") return functionOptions;
    
    return functionOptions.filter(func => func.id === currentUser.function?.id);
  };

  if (loading && !showForm) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Member Management</h1>

      {successMsg && (
        <Alert color="success" className="mb-4" onDismiss={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert color="failure" className="mb-4" onDismiss={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      )}

      {!showForm && (
        <Button onClick={handleAddMemberClick} disabled={loading}>
          Add Member
        </Button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mt-6 dark:bg-[rgb(26,35,58)]">
          <h2 className="text-lg font-medium mb-4 dark:text-gray-50">
            {editing ? "Edit Member" : "Add Member"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">First Name *</label>
              <TextInput 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Last Name *</label>
              <TextInput 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-200">Email *</label>
            <TextInput 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              type="email" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-200">AIESEC Email *</label>
            <TextInput 
              name="aiesecEmail" 
              value={formData.aiesecEmail} 
              onChange={handleChange} 
              type="email" 
              required 
              disabled={editing}
              helperText="Must end with @aiesec.net"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Birthday *</label>
              <TextInput 
                type="date" 
                name="birthday" 
                value={formData.birthday} 
                onChange={handleChange} 
                required 
                max={getTodayDateString()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Joined Date *</label>
              <TextInput 
                type="date" 
                name="joinedDate" 
                value={formData.joinedDate} 
                onChange={handleChange} 
                required 
                max={getTodayDateString()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={currentUser.role === "Team_Leader"}
              >
                <option value="">Select Role</option>
                {getAvailableRoles().map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-200">Function *</label>
            <select
              name="function"
              value={formData.function}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
              disabled={currentUser.role !== "LCP"}
            >
              <option value="">Select Function</option>
              {getAvailableFunctions().map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {formData.role && formData.function && (
            <div className="mb-4">
              <label className="block text-sm font-medium dark:text-gray-200">
                {formData.role === "Member" ? "Team Leader *" : "Supervisor"}
              </label>
              <select
                name="teamLeaderAiesecEmail"
                value={formData.teamLeaderAiesecEmail}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required={formData.role === "Team_Leader" || formData.role === "Member"}
                disabled={currentUser.role === "Team_Leader"}
              >
                <option value="">Select {formData.role === "Member" ? "Team Leader" : "Supervisor"}</option>
                {(() => {
                  let filtered = [];

                  if (formData.role === "LCVP") {
                    filtered = members.filter((m) => m.role === "LCP");
                  } else if (formData.role === "Team_Leader") {
                    filtered = members.filter((m) => m.role === "LCVP" && m.function?.id === parseInt(formData.function));
                  } else if (formData.role === "Member") {
                    filtered = members.filter((m) => m.role === "Team_Leader" && m.function?.id === parseInt(formData.function));
                  }

                  return filtered.map((leader) => (
                    <option key={leader.aiesecEmail} value={leader.aiesecEmail}>
                      {leader.firstName} {leader.lastName} ({leader.aiesecEmail})
                    </option>
                  ));
                })()}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <Button type="button" color="light" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : editing ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mt-6 dark:bg-[rgb(26,35,58)]">
        <h2 className="text-lg font-medium mb-4 dark:text-gray-50">Members List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">AIESEC Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-[rgb(26,35,58)] dark:divide-gray-700">
              {getFilteredMembers().map((member) => (
                <tr key={member.aiesecEmail}>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {member.firstName} {member.lastName}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {member.aiesecEmail}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {member.role}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      {hasEditPermission(member) && (
                        <Button color="warning" onClick={() => handleEdit(member)}>
                          Edit
                        </Button>
                      )}
                      {hasDeletePermission(member) && (
                        <Button color="failure" onClick={() => openDeleteModal(member)}>
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this member?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDelete} disabled={loading}>
                {loading ? "Deleting..." : "Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)} disabled={loading}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}