import { Button, Label, TextInput, Spinner, Alert } from 'flowbite-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({
    aiesecEmail: '',
    password: ''
  });
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Clear error when user starts typing
    if (fieldErrors[e.target.id]) {
      setFieldErrors({...fieldErrors, [e.target.id]: ''});
    }
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {...fieldErrors};

    if (!formData.aiesecEmail) {
      newErrors.aiesecEmail = 'AIESEC Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.aiesecEmail) && email.endsWith("@aiesec.net")) {
      newErrors.aiesecEmail = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch('https://aiesecinruhuna-production.up.railway.app/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        return dispatch(signInFailure(data.message));
      }

      dispatch(signInSuccess(data));

      console.log('User signed in successfully:', data.role);
      // Role-based redirection
      if (data.role === 'LCP') {
        navigate('/dashboard');
      } else if (data.role === 'LCVP') {
        navigate('/dashboard');
      } else if (data.role === 'Team_Leader') {
        navigate('/dashboard');
      } else if(data.role === 'Member'){
        navigate('/dashboard');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
            You can sign in with your AIESEC email and password.
          </p>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}> 
            <div>
              <Label value='Your AIESEC Email' className='font-semibold'/>
              <TextInput 
                type='email' 
                placeholder='AIESEC Email' 
                id='aiesecEmail' 
                onChange={handleChange}
                color={fieldErrors.aiesecEmail ? 'failure' : ''}
                helperText={
                  fieldErrors.aiesecEmail && (
                    <span className="text-red-600 text-xs">
                      {fieldErrors.aiesecEmail}
                    </span>
                  )
                }
              />
            </div>
            <div>
              <Label value='Your Password' className='font-semibold' />
              <TextInput 
                type='password' 
                placeholder='⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤' 
                id='password'  
                onChange={handleChange}
                color={fieldErrors.password ? 'failure' : ''}
                helperText={
                  fieldErrors.password && (
                    <span className="text-red-600 text-xs">
                      {fieldErrors.password}
                    </span>
                  )
                }
              />
            </div>
            
            {/* Display server error messages */}
            {errorMessage && (
              <Alert color="failure" className="mb-4">
                {errorMessage}
              </Alert>
            )}
            
            <Button 
              className="bg-gradient-to-r from-[#037ef3] via-[#5aa9f4] to-[#a3d4f7] text-white" 
              type='submit'  
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <div className="flex justify-end text-sm ">
              <Link to="/forgot-password" className="text-blue-600 hover:underline text-center">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}