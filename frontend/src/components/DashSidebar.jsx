import { Sidebar } from 'flowbite-react';
import {
    HiUser,
    HiArrowSmRight,
    HiNewspaper ,
    HiCreditCard ,
    HiCake ,
    HiChartPie,
    HiUserGroup,
} from 'react-icons/hi';
import { HiRectangleStack } from "react-icons/hi2";
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
         console.log('User signed out successfully:', data.message);
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  
  // If no currentUser, render nothing or a loading spinner.

  const getUserRoleLabel = () => {
    if (currentUser != null) {
      if (currentUser.role === 'LCP') return true;  
      if (currentUser.role === 'LCVP') return 'LCVP';
      if (currentUser.role === 'Team Leader') return 'Team Leader';
    }
    return 'Member';
  }; // You can replace this with a loading spinner if needed
 

  

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
         
          { (currentUser.role === 'LCP' || currentUser.role === 'LCVP' || currentUser.role === 'Team_Leader') && (
            <>
              <Link to='/dashboard?tab=dash'>
                <Sidebar.Item
                  active={tab === 'dash' || !tab}
                  icon={HiChartPie}
                  as='div'
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            </>
          )}

          {(currentUser.role === 'LCP' || currentUser.role === 'LCVP') && (
            <>
              
                <Link to='/dashboard?tab=manageCommittee'>
                <Sidebar.Item
                    active={tab === 'manageCommittee'}
                    icon={HiUserGroup}
                    as='div'
                >
                Manage Committee
                </Sidebar.Item>
                </Link>

                <Link to='/dashboard?tab=finance'>
                <Sidebar.Item
                active={tab === 'finance'}
                icon={ HiCreditCard}
                as='div'
                >
                Finance
                </Sidebar.Item>
                </Link>
            </>
          )}
          {(currentUser.role === 'LCP' || currentUser.role === 'LCVP' || currentUser.role === 'Team_Leader' ) && (
            <>
              <Link to='/dashboard?tab=task'>
                <Sidebar.Item
                  active={tab === 'task'}
                  icon={HiNewspaper }
                  as='div'
                >
                  Tasks
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=event'>
                <Sidebar.Item
                  active={tab === 'event'}
                  icon={HiRectangleStack}
                  as='div'
                >
                  Events
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=birthday'>
                <Sidebar.Item
                  active={tab === 'birthday'}
                  icon={HiCake}
                  as='div'
                >
                  Birthday
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={getUserRoleLabel()}  // Get the correct label based on role
              labelColor='dark'
              as='div'
            >
              Profile 
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}