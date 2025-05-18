import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Button, TextInput, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signoutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile updated successfully");
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
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
        <p className="text-sm text-gray-600 mb-8">This information will be displayed publicly so be careful what you share.</p>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">AIESEC Email</label>
            <p className="text-sm text-gray-600">workcation.com/johndoe</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <p className="text-sm text-gray-600">workcation.com/johndoe</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Function</label>
            <p className="text-sm text-gray-600">workcation.com/johndoe</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <p className="text-sm text-gray-600">workcation.com/johndoe</p>
          </div>

          <div className="mb-8">
            <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About</label>
            <textarea
              id="about"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write something about you..."
              onChange={handleChange}
            />
            <p className="text-sm text-gray-600 mb-2">Write a few sentences about yourself.</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <div className="flex items-center">
              <div className="mr-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                  {imageFileUrl ? (
                    <img src={imageFileUrl} alt="Profile" className="w-full h-full object-cover" />
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
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
        <p className="text-sm text-gray-600 mb-8">Use a permanent address where you can receive mail.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <TextInput
              id="firstName"
              type="text"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <TextInput
              id="lastName"
              type="text"
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <TextInput
            id="email"
            type="email"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">Street address</label>
          <TextInput
            id="streetAddress"
            type="text"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <TextInput
              id="city"
              type="text"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
            <TextInput
              id="state"
              type="text"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal code</label>
            <TextInput
              id="zipCode"
              type="text"
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