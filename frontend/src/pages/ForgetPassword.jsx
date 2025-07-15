import { Button, Label, TextInput, Spinner } from 'flowbite-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('https://aiesecinruhuna-production.up.railway.app/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) setStep(2);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('https://aiesecinruhuna-production.up.railway.app/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) setStep(3);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        return setMessage('Passwords do not match');
      }

      const res = await fetch('https://aiesecinruhuna-production.up.railway.app/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword, confirmPassword }),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) window.location.href = '/signin';
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-10 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className=''>
          <Link to="/" className="flborder-b-2 flex justify-between items-centerex items-center">
              <img src='/AiR_logo.png' alt="AIESEC UOR Logo" className="h-24 w-auto sm:h-28 " />
          </Link>
          <p className='text-sm st-5'>
            Reset your password with your AIESEC email.
          </p>
        </div>
        {/* right */}
        <div className='flex-1'>
          {step === 1 && (
            <form className='flex flex-col gap-4' onSubmit={handleSendCode}>
              <h2 className='text-2xl font-semibold'>Forgot Password?</h2>
              <div>
                <Label value='Your AIESEC Email' className='font-semibold' />
                <TextInput 
                  type='email' 
                  placeholder='AIESEC Email' 
                  onChange={(e) => setEmail(e.target.value)} 
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
                    <span className='pl-3'>Sending...</span>
                  </>
                ) : (
                  'Send Code'
                )}
              </Button>
              {message && <p className="text-sm text-center">{message}</p>}
            </form>
          )}

          {step === 2 && (
            <form className='flex flex-col gap-4' onSubmit={handleVerifyCode}>
              <h2 className='text-2xl font-semibold'>Enter Verification Code</h2>
              <div>
                <Label value='Verification Code' className='font-semibold' />
                <TextInput 
                  type='text' 
                  placeholder='6-digit code' 
                  onChange={(e) => setCode(e.target.value)} 
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
                    <span className='pl-3'>Verifying...</span>
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
              {message && <p className="text-sm text-center">{message}</p>}
            </form>
          )}

          {step === 3 && (
            <form className='flex flex-col gap-4' onSubmit={handleResetPassword}>
              <h2 className='text-2xl font-semibold'>Reset Password</h2>
              <div>
                <Label value='New Password' className='font-semibold' />
                <TextInput 
                  type='password' 
                  placeholder='⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤' 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required
                />
              </div>
              <div>
                <Label value='Confirm Password' className='font-semibold' />
                <TextInput 
                  type='password' 
                  placeholder='⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤' 
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
                    <span className='pl-3'>Resetting...</span>
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
              {message && <p className="text-sm text-center">{message}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}