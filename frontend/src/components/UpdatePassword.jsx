import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TextInput, Button, Alert } from "flowbite-react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
console.log("currentUser:", currentUser);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // You can skip this check if always defined
  if (!currentUser) {
    return setErrorMsg("User not found. Please log in again.");
  }

  if (formData.currentPassword === formData.newPassword) {
    return setErrorMsg("New password must be different from current password");
  }

  if (formData.newPassword !== formData.confirmPassword) {
    return setErrorMsg("New passwords do not match");
  }

  if (formData.newPassword.length < 6) {
    return setErrorMsg("Password must be at least 6 characters");
  }

  try {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await fetch("https://aiesecruhuna-production.up.railway.app/api/users/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAiesecEmail: currentUser.aiesecEmail,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    });

    let data = {};
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = { message: await res.text() };
    }

    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data.message || "Failed to update password");
    } else {
      setSuccessMsg("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  } catch (error) {
    setLoading(false);
    setErrorMsg(error.message || "An error occurred");
  }
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.id]: e.target.value,
  });
};

const togglePasswordVisibility = (field) => {
  setShowPasswords((prev) => ({
    ...prev,
    [field]: !prev[field],
  }));
};

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Update Password</h1>

      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-[rgb(16,23,42)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-1 dark:text-gray-200">
              Current Password
            </label>
            <div className="relative">
              <TextInput
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-1 dark:text-gray-200">
              New Password
            </label>
            <div className="relative">
              <TextInput
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 dark:text-gray-200">
              Confirm Password
            </label>
            <div className="relative">
              <TextInput
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button color="light" type="button" onClick={() => setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>

          {successMsg && <Alert color="success" className="mt-4">{successMsg}</Alert>}
          {errorMsg && <Alert color="failure" className="mt-4">{errorMsg}</Alert>}
        </form>
      </div>
    </div>
  );
}
