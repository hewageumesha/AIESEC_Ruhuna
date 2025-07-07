import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.currentPassword === formData.newPassword) {
      return setError('New password must be different from current password');
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      return setError('New passwords do not match');
    }
    
    if (formData.newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser._id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (!res.ok) {
        setError(data.message || 'Failed to update password');
      } else {
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Update Password
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <label htmlFor="currentPassword" className="md:col-span-1 font-medium text-gray-700">
            Current Password
          </label>
          <div className="md:col-span-3 relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.current ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <label htmlFor="newPassword" className="md:col-span-1 font-medium text-gray-700">
            New Password
          </label>
          <div className="md:col-span-3 relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.new ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <label htmlFor="confirmPassword" className="md:col-span-1 font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="md:col-span-3 relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirm ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
          Password updated successfully!
        </div>
      )}
    </div>
  );
}