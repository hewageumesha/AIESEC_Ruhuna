import { useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router";

const DashManageCommittee = ({ userRole, departments, functions, onSubmit }) => {
  const [formData, setFormData] = useState({
    aiesecEmail: "",
    departmentName: "",
    functionName: "",
    startDate: "",
    roleType: "Team_Leader", // Default to Team Leader
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();
    console.log(formData);

    // Role-Based Validation
    if (formData.roleType === "LCVP" && userRole !== "LCP") {
      alert("Only LCP can add an LCVP.");
      return;
    }

    if (!formData.aiesecEmail || !formData.departmentName || !formData.roleType) {
      alert("Please fill all required fields.");
      return;
    }

    // Additional Validation for LCVP
    if (formData.roleType === "LCVP" && (!formData.functionName || !formData.startDate)) {
      alert("Please provide all details for LCVP.");
      return;
    }

    try {
      // Prepare data for submission
      const dataToSend = { ...formData };

      // Make the request to the backend
      const response = await axios.post('http://localhost:5173/api/user/committee/add', dataToSend, {
        withCredentials: true,  // Ensure cookies are sent with requests
      });
      
      // If the request is successful, handle response
      if (response.data.success) {
        alert("Action successful");
        // Call your onSubmit function if you want to update the state in the parent component
        onSubmit(response.data);
      }
      
      // Reset form
      setFormData({
        aiesecEmail: "",
        departmentName: "",
        functionName: "",
        startDate: "",
        roleType: "Team_Leader",
      });
    } catch (error) {
      alert("An error occurred while processing the request.");
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-semibold mb-4">Manage Committee</h2>

      {/* Add New Member Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add members to the Committee</h3>

        {/* Email Field */}
        <div className="mb-3">
          <label className="block text-gray-700">AIESEC Email</label>
          <input
            type="email"
            name="aiesecEmail"
            value={formData.aiesecEmail}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Select Role */}
        <div className="mb-3">
          <label className="block text-gray-700">Select Role</label>
          <select
            name="roleType"
            value={formData.roleType}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
          >
            {(userRole === "LCP") && <option value="LCVP">LCVP</option>}
            <option value="Team_Leader">Team Leader</option>
            <option value="Member">Team Member</option>
          </select>
        </div>

        {/* Department Selection */}
        <div className="mb-3">
          <label className="block text-gray-700">Department Name</label>
          <select
            name="departmentName"
            value={formData.departmentName}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          >
            <option value="">Select Department</option>
            {/* Departments List */}
                  {(departments || []).map((dept) => (
                    <option key={dept} value={dept}>
                    {dept}
                    </option>
                  ))}
                  <option value="1">iGV B2B & VD</option>
                  <option value="2">IGV M & IR</option>
                  <option value="3">iGT B3B & VD</option>
                  <option value="4">IGT M & IR</option>
                  <option value="5">oGV B2C</option>
                  <option value="6">oGV PS</option>
                  <option value="7">TM</option>
                  <option value="8">FnL</option>
                  <option value="9">BD</option>
                  <option value="10">ED</option>
                  <option value="11">MKT</option>
                  <option value="12">PR</option>
                  <option value="13">Q&A</option>
                  <option value="14">Others</option>
                  </select>
                  </div>

                  {/* Function Selection */}
        <div className="mb-3">
          <label className="block text-gray-700">Function Name</label>
          <select
            name="functionName"
            value={formData.functionName}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          >
            <option value="">Select Function</option>
            {/* Functions List */}
                  {(functions || []).map((func) => (
                    <option key={func.value} value={func.value}>
                    {func.label}
                    </option>
                  ))}
                  <option value="1">BD - Business/Partnership Development</option>
                  <option value="2">EWA - Engagement With AIESEC</option>
                  <option value="3">FIN - Finance</option>
                  <option value="4">ICX - Incoming Exchange</option>
                  <option value="5">IM - Information Management</option>
                  <option value="6">MKT - Marketing</option>
                  <option value="7">OD - Organistional Development/Expansions</option>
                  <option value="8">OGX - Outgoing Exchange</option>
                  <option value="9">Others</option>
                  <option value="10">President</option>
                  <option value="11">Q&A - Quality & Audit</option>
                  <option value="12">TM - Talent Management</option>
                  </select>
                </div>

                {/* Start Date */}
        <div className="mb-3">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => {
            if (!formData.aiesecEmail) {
              alert("Please provide an AIESEC Email to add.");
              return;
            }
            handleSubmit({
              ...formData,
              action: "add",
            });
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-md w-full mb-2"
        >
          Add
        </button>

        {/* Update Button
        <button
          type="button"
          onClick={() => {
            if (!formData.aiesecEmail) {
              alert("Please provide an AIESEC Email to update.");
              return;
            }
            handleSubmit({
              ...formData,
              action: "update",
            });
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md w-full mb-2"
        >
          Update 
        </button> */}

        {/* Delete Button 
        <button
          type="button"
          onClick={() => {
            if (!formData.aiesecEmail) {
              alert("Please provide an AIESEC Email to delete.");
              return;
            }
            handleSubmit({
              ...formData,
              action: "delete",
            });
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
        >
          Delete 
        </button> */}
      </form>
    </div>
  );
};

export default DashManageCommittee;
