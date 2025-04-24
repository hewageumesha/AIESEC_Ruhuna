import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  useEffect(() => {
    const aiesecEmail = currentUser.aiesecEmail; 
    const fetchUserData = async () => {
        try {
            
            const response = await fetch(`/api/users/${aiesecEmail}`);
            const data = await response.json();
            setCurrentUser(data); // Store user details including functionName
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    if (!aiesecEmail) fetchUserData();
});

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
  
    if (!imageFile) {
      setImageFileUploadError("Please select an image file.");
      setImageFileUploading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("image", imageFile);
  
    try {
      const response = await fetch("http://localhost:5173/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }
  
      setImageFileUrl(data.imageUrl); // Store the image URL
      setFormData((prevFormData) => ({
        ...prevFormData,
        profilePicture: data.imageUrl
      })); // Save in form
      setImageFileUploading(false);
    } catch (error) {
      setImageFileUploadError(error.message);
      setImageFileUploading(false);
    }
  };  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
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
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/updatePassword/${currentUser.aiesecEmail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdateUserError(data.message);
      } else {
        setUpdateUserSuccess('Password updated successfully');
        setPassword('');
      }
    } catch (error) {
      setUpdateUserError(error.message);
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
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutSuccess());
      navigate('/sign-in');
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchDepartmentAndFunction = async () => {
      try {
        const departmentRes = await fetch(`/api/department/${currentUser.departmentId}`);
        const functionRes = await fetch(`/api/function/${currentUser.functionId}`);
        const departmentData = await departmentRes.json();
        const functionData = await functionRes.json();

        if (departmentRes.ok && functionRes.ok) {
          setFormData({
            ...formData,
            departmentName: departmentData.departmentName,
            functionName: functionData.functionName,
          });
        } else {
          console.error('Failed to fetch department or function details');
        }
      } catch (error) {
        console.error('Error fetching department or function details:', error);
      }
    };

    if (currentUser.departmentId && currentUser.functionId) {
      fetchDepartmentAndFunction();
    }
  }, [currentUser.departmentId, currentUser.functionId]);

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <div className='flex flex-col gap-4'>
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src="{imageFileUrl || currentUser.profilePicture}"
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        <div>
          <p><strong>First Name:</strong> {currentUser.firstName}</p>
          <p><strong>Last Name:</strong> {currentUser.lastName}</p>
          <p><strong>Role:</strong> {currentUser.role}</p>
          <p><strong>Department:</strong> {formData.departmentName}</p>
          <p><strong>Function:</strong> {formData.functionName}</p>
          <p><strong>Joined Date:</strong> {currentUser.joinedDate}</p>
        </div>
      </div>

      {/* <form onSubmit={handlePasswordSubmit} className='flex flex-col gap-4 mt-5'>
        <TextInput
          type='password'
          id='password'
          placeholder='New Password'
          value={password}
          onChange={handlePasswordChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={loading}
        >
          Update Password
        </Button>
      </form> */}
      {/* <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={handleSignout} className='cursor-pointer'>
          Sign Out
        </span>
      </div> */}

      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
