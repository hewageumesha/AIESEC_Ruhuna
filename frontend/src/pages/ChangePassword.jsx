import { Button, Label, TextInput, Spinner, Alert } from 'flowbite-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError('Please fill all fields');
    }

    if (newPassword.length < 8) {
      return setError('Password must be at least 8 characters');
    }

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (currentPassword === newPassword) {
      return setError('New password must be different from current password');
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setSuccess('Password changed successfully! Redirecting...');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.message || 'An error occurred while changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className=''>
          <Link to="/" className="flborder-b-2 flex justify-between items-centerex items-center">
              <img src='/AiR_logo.png' alt="AIESEC UOR Logo" className="h-24 w-auto sm:h-28 " />
          </Link>
          <p className='text-sm st-5'>
            Change your account password securely.
          </p>
        </div>
        
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <h2 className='text-2xl font-semibold'>Change Password</h2>
            
            {error && (
              <Alert color="failure" onDismiss={() => setError('')}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert color="success" onDismiss={() => setSuccess('')}>
                {success}
              </Alert>
            )}
            
            <div>
              <Label value='Current Password' className='font-semibold' />
              <TextInput 
                type='password' 
                placeholder='Enter current password' 
                id='currentPassword'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label value='New Password' className='font-semibold' />
              <TextInput 
                type='password' 
                placeholder='Enter new password (min 8 characters)' 
                id='newPassword'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label value='Confirm New Password' className='font-semibold' />
              <TextInput 
                type='password' 
                placeholder='Confirm new password' 
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              className="bg-gradient-to-r from-[#037ef3] via-[#5aa9f4] to-[#a3d4f7] text-white" 
              type='submit' 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Updating...</span>
                </>
              ) : (
                'Change Password'
              )}
            </Button>
            
            <div className="flex justify-center text-sm">
              <Link to="/profile" className="text-blue-600 hover:underline">
                Back to Profile
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}