import { Button, Label, TextInput } from 'flowbite-react';
import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
    if (res.ok) setStep(2);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    setMessage(data.message);
    if (res.ok) setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      return setMessage('Passwords do not match');
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: newPassword, confirmPassword }),
    });

    const data = await res.json();
    setMessage(data.message);
    if (res.ok) window.location.href = '/signin';
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='max-w-md w-full bg-white p-6 shadow-lg rounded-lg'>
        {step === 1 && (
          <>
            <h2 className='text-2xl font-semibold text-center mb-4'>Forgot Password?</h2>
            <form onSubmit={handleSendCode} className='flex flex-col gap-4'>
              <Label value='Enter your email' />
              <TextInput type='email' placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
              <Button type='submit' className="bg-blue-500 text-white">Send Code</Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className='text-2xl font-semibold text-center mb-4'>Enter Verification Code</h2>
            <form onSubmit={handleVerifyCode} className='flex flex-col gap-4'>
              <Label value='Enter Code' />
              <TextInput type='text' placeholder='6-digit code' onChange={(e) => setCode(e.target.value)} />
              <Button type='submit' className="bg-blue-500 text-white">Verify</Button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className='text-2xl font-semibold text-center mb-4'>Reset Password</h2>
            <form onSubmit={handleResetPassword} className='flex flex-col gap-4'>
              <Label value='New Password' />
              <TextInput type='password' placeholder='Enter new password' onChange={(e) => setNewPassword(e.target.value)} />
              <Label value='Confirm Password' />
              <TextInput type='password' placeholder='Confirm password' onChange={(e) => setConfirmPassword(e.target.value)} />
              <Button type='submit' className="bg-blue-500 text-white">Reset Password</Button>
            </form>
          </>
        )}

        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}
