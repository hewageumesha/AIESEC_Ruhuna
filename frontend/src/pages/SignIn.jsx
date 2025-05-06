import { Button, Label, TextInput, Spinner } from 'flowbite-react';
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
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.aiesecEmail || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('http://localhost:8080/api/auth/signin', {
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
              <TextInput type='email' placeholder=' AIESEC Email' id='aiesecEmail' onChange={handleChange}/>
            </div>
            <div>
              <Label value='Your Password' className='font-semibold' />
              <TextInput type='password' placeholder='⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤' id='password'  onChange={handleChange}/>
            </div>
            {/* {errorMessage && <div className="text-red-500">{errorMessage}</div>} */}
            <Button className="bg-gradient-to-r from-[#037ef3] via-[#5aa9f4] to-[#a3d4f7] text-white" type='submit'  disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
           
          </form>
        </div>
      </div>
    </div>
  );
}
