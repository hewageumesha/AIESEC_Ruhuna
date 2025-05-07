import { Button, Label, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Something went wrong. Try again.');
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='max-w-md w-full bg-white p-6 shadow-lg rounded-lg'>
        <h2 className='text-2xl font-semibold text-center mb-4'>Reset Password</h2>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <Label value='New Password' />
          <TextInput type='password' placeholder='Enter new password' onChange={(e) => setPassword(e.target.value)} />
          <Button type='submit' className="bg-blue-500 text-white">Reset Password</Button>
        </form>
        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}
