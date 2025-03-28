import { Sidebar } from 'flowbite-react';
import {
    HiUser,
    HiArrowSmRight,
    HiNewspaper ,
    HiCreditCard ,
    HiCake ,
    HiChartPie,
    HiRectangleStack,
    HiUserGroup,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
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
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // If no currentUser, render nothing or a loading spinner.
  if (!currentUser) {
    return null; // You can replace this with a loading spinner if needed
  }

  // Function to return user role label
  const getUserRoleLabel = () => {
    if (currentUser.isAdmin || currentUser.role === 'lcp') return 'LCP';  // Admin is treated as LCP
    if (currentUser.role === 'lcvp') return 'LCVP';
    if (currentUser.role === 'tl') return 'Team Leader';
    return 'Member'; // Default role is Member
  };

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {currentUser && (currentUser.isAdmin || currentUser.role === 'lcp') || currentUser.role === 'lcvp' || currentUser.role === 'tl' && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
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
          {(currentUser.isAdmin || currentUser.role === 'lcp') || currentUser.role === 'lcvp' && (
            <>
                <Link to='/dashboard?tab=committee'>
                <Sidebar.Item
                    active={tab === 'committee'}
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
          {(currentUser.isAdmin || currentUser.role === 'lcp') || currentUser.role === 'lcvp' || currentUser.role === 'tl'&& (
            <>
              <Link to='/dashboard?tab=tasks'>
                <Sidebar.Item
                  active={tab === 'tasks'}
                  icon={HiNewspaper }
                  as='div'
                >
                  Tasks
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=events'>
                <Sidebar.Item
                  active={tab === 'events'}
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