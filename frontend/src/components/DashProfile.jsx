import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Button, TextInput } from 'flowbite-react';
import { updateStart, updateSuccess, updateFailure, signoutSuccess } from '../redux/user/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import UpdatePassword from './UpdatePassword'; // ✅ Make sure to implement or import this component

export default function DashProfile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const subtab = urlParams.get("subtab");

  useEffect(() => {
    fetchProfileData();
  }, [currentUser]);

  const fetchProfileData = async () => {
    try {
      const profile = await axios.get(`http://localhost:8080/api/users/profile/${currentUser.aiesecEmail}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setProfileData(profile.data);
      setFormData(profile.data);

      if (profile.data.role === 'Member') {
        //const teamLeader = await axios.get(`http://localhost:8080/api/users/team-leader/${profile.data.id}`, {
        //  headers: { Authorization: `Bearer ${currentUser.token}` }
        //});
        setProfileData({ ...profile.data });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (phone) => phone.replace(/\D/g, '').length === 10;
  const validateBirthday = (date) => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(date)) return false;
    const birthday = new Date(date);
    return birthday instanceof Date && !isNaN(birthday) && birthday < new Date();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    const errors = { ...validationErrors };
    if (id === 'email') {
      errors.email = validateEmail(value) ? '' : 'Please enter a valid email address';
    } else if (id === 'phoneNumber') {
      errors.phoneNumber = validatePhoneNumber(value) ? '' : 'Phone number must be 10 digits';
    } else if (id === 'birthday') {
      errors.birthday = validateBirthday(value) ? '' : 'Please enter a valid date (YYYY-MM-DD)';
    }
    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (
      (formData.email && !validateEmail(formData.email)) ||
      (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) ||
      (formData.birthday && !validateBirthday(formData.birthday))
    ) {
      setValidationErrors({
        email: !validateEmail(formData.email) ? 'Please enter a valid email address' : '',
        phoneNumber: !validatePhoneNumber(formData.phoneNumber) ? 'Phone number must be 10 digits' : '',
        birthday: !validateBirthday(formData.birthday) ? 'Please enter a valid date (YYYY-MM-DD)' : '',
      });
      return;
    }

    try {
      dispatch(updateStart());
      const updatedData = { ...profileData, ...formData };
      const res = await fetch(`http://localhost:8080/api/users/update/${currentUser.aiesecEmail}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('Profile updated successfully');
        fetchProfileData();
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {subtab === 'password' ? (
        <UpdatePassword />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          {/* Profile Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[rgb(26,35,58)]">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">Profile Information</h2>
            <p className="text-sm text-gray-600 mb-8 dark:text-gray-400">This information will be displayed publicly so be careful what you share.</p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">AIESEC Email</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.aiesecEmail}</p>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Function</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.function?.name}</p>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Role</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.role}</p>
            </div>
            {currentUser.role === 'Member' || currentUser.role === 'Team_Leader'&& (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Assigned Team Leader</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.teamLeaderAiesecEmail}</p>
              </div>
            )}
            <div className="mb-8">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">About</label>
              <textarea
                id="about"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800"
                placeholder="Write something about you..."
                value={formData.about || ''}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">Write a few sentences about yourself.</p>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Photo</label>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                    {imageFileUrl ? (
                      <img src={imageFileUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : profileData.profilePicture ? (
                      <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )}
                  </div>
                </div>
                <Button color="light" onClick={() => filePickerRef.current.click()}>
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[rgb(26,35,58)]">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">Personal Information</h2>
            <p className="text-sm text-gray-600 mb-8 dark:text-gray-400">Use a permanent address where you can receive mail.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">First name</label>
                <TextInput id="firstName" type="text" value={formData.firstName || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Last name</label>
                <TextInput id="lastName" type="text" value={formData.lastName || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Birthday</label>
                <TextInput id="birthday" type="text" value={formData.birthday || ''} onChange={handleChange} />
                {validationErrors.birthday && <p className="text-red-500 text-xs">{validationErrors.birthday}</p>}
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Gender</label>
                <TextInput id="gender" type="text" value={formData.gender || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Email address</label>
                <TextInput id="email" type="email" value={formData.email || ''} onChange={handleChange} />
                {validationErrors.email && <p className="text-red-500 text-xs">{validationErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Phone Number</label>
                <TextInput id="phoneNumber" type="text" value={formData.phoneNumber || ''} onChange={handleChange} />
                {validationErrors.phoneNumber && <p className="text-red-500 text-xs">{validationErrors.phoneNumber}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Street address</label>
              <TextInput id="streetAddress" type="text" value={formData.streetAddress || ''} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">City</label>
                <TextInput id="city" type="text" value={formData.city || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="stateORProvince" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">State / Province</label>
                <TextInput id="stateORProvince" type="text" value={formData.stateORProvince || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="ziporpostalCode" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">ZIP / Postal code</label>
                <TextInput id="ziporpostalCode" type="text" value={formData.ziporpostalCode || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="s_department" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Studying Department</label>
                <TextInput id="s_department" type="text" value={formData.s_department || ''} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Faculty</label>
                <TextInput id="faculty" type="text" value={formData.faculty || ''} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button color="light">Cancel</Button>
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </>
      )}

      {updateUserSuccess && (
        <Alert color="success" className="mt-4">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-4">
          {updateUserError}
        </Alert>
      )}
    </div>
  );
}
