import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Button, TextInput, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signoutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

export default function UserProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phoneNumber: '',
    birthday: ''
  });
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchProfileData();
  }, [currentUser, navigate]);

  const fetchProfileData = async () => {
    try {
      const profile = await axios.get(`http://localhost:8080/api/users/profile/${currentUser.aiesecEmail}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      setProfileData(profile.data);
      setFormData(profile.data);

      // If the user is a member, fetch their team leader
      if (profile.data.role === 'Member') {
        const teamLeader = await axios.get(`http://localhost:8080/api/users/team-leader/${profile.data.id}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setProfileData({ ...profile.data, teamLeader: teamLeader.data });
      } else {
        setProfileData(profile.data);
      }
      return profile.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it has exactly 10 digits
    return digitsOnly.length === 10;
  };

  const validateBirthday = (date) => {
    // Basic date validation - format YYYY-MM-DD
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(date)) return false;
    
    const birthday = new Date(date);
    const today = new Date();
    
    // Check if date is valid and not in the future
    return birthday instanceof Date && !isNaN(birthday) && birthday < today;
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

    // Validate fields as user types
    if (id === 'email') {
      setValidationErrors({
        ...validationErrors,
        email: validateEmail(value) ? '' : 'Please enter a valid email address'
      });
    } else if (id === 'phoneNumber') {
      setValidationErrors({
        ...validationErrors,
        phoneNumber: validatePhoneNumber(value) ? '' : 'Phone number must be 10 digits'
      });
    } else if (id === 'birthday') {
      setValidationErrors({
        ...validationErrors,
        birthday: validateBirthday(value) ? '' : 'Please enter a valid date (YYYY-MM-DD)'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    
    // Validate all fields before submission
    const errors = {};
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (formData.birthday && !validateBirthday(formData.birthday)) {
      errors.birthday = 'Please enter a valid date (YYYY-MM-DD)';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      dispatch(updateStart());
      const updatedData = { ...profileData, ...formData };
      const res = await fetch(`http://localhost:8080/api/users/update`, {
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
        setUpdateUserSuccess("Profile updated successfully");
        fetchProfileData(); // Refresh profile data
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${email}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[rgb(16,23,42)]">
        <h2 className="text-lg font-medium text-gray-900  dark:text-gray-50">Profile Information</h2>
        <p className="text-sm text-gray-600 mb-8  dark:text-gray-400">This information will be displayed publicly so be careful what you share.</p>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">AIESEC Email</label>
            <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.aiesecEmail}</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Department</label>
            <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.department?.name}</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Function</label>
            <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.function?.name}</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Role</label>
            <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.role}</p>
          </div>

          {currentUser.role == 'Member' && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Assigned Team Leader</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {profileData.teamLeaderAiesecEmail}
              </p>
            </div>
          )}

          <div className="mb-8">
            <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">About</label>
            <textarea
              id="about"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write something about you..."
              onChange={handleChange}
            />
            <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">Write a few sentences about yourself.</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Photo</label>
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
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[rgb(16,23,42)]">
        <h2 className="text-lg font-medium text-gray-900  dark:text-gray-50">Personal Information</h2>
        <p className="text-sm text-gray-600 mb-8 dark:text-gray-400">Use a permanent address where you can receive mail.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">First name</label>
            <TextInput
              id="firstName"
              type="text"
              value={formData.firstName || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Last name</label>
            <TextInput
              id="lastName"
              type="text"
              value={formData.lastName || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Birthday</label>
            <TextInput
              id="birthday"
              type="text"
              value={formData.birthday || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Gender</label>
            <TextInput
              id="gender"
              type="text"
              value={formData.gender || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Email address</label>
            <TextInput
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Phone Number</label>
            <TextInput
              id="phoneNumber"
              type="text"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">Street address</label>
          <TextInput
            id="streetAddress"
            type="text"
            value={formData.streetAddress || ''}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">City</label>
            <TextInput
              id="city"
              type="text"
              value={formData.city || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="stateORProvince" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">State / Province</label>
            <TextInput
              id="stateORProvince"
              type="text"
              value={formData.stateORProvince ||''}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="ziporpostalCode" className="block text-sm font-medium text-gray-700 mb-1  dark:text-gray-200">ZIP / Postal code</label>
            <TextInput
              id="ziporpostalCode"
              type="text"
              value={formData.ziporpostalCode || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
          <Button color="light">Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
      </div>

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

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
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