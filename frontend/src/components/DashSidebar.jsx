import { Sidebar } from 'flowbite-react';
import React from 'react';
import {
    HiUser,
    HiArrowSmRight,
    HiNewspaper,
    HiCreditCard,
    HiCake,
    HiChartPie,
    HiUserGroup,
    HiChevronDown,
    HiChevronUp,
    HiLockClosed
} from 'react-icons/hi';
import { HiRectangleStack, HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar({ tab, subtab }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user)
  const [isCommitteeExpanded, setIsCommitteeExpanded] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      // Close menus if another tab is selected
      if (tabFromUrl !== 'manageCommittee') {
        setIsCommitteeExpanded(false);
      }
      if (tabFromUrl !== 'profile') {
        setIsProfileExpanded(false);
      }
    }
  }, [location.search]);

  useEffect(() => {
    // Auto-expand menus if their tab is active on desktop
    if (!isMobile) {
      if (tab === 'manageCommittee') setIsCommitteeExpanded(true);
      if (tab === 'profile') setIsProfileExpanded(true);
    }
  }, [tab, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, collapse menus when switching to desktop view
      if (window.innerWidth >= 768) {
        if (tab === 'manageCommittee') setIsCommitteeExpanded(true);
        if (tab === 'profile') setIsProfileExpanded(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tab]);

  const getUserRoleLabel = () => {
    if (currentUser != null) {
      if (currentUser.role === 'LCP') return true;  
      if (currentUser.role === 'LCVP') return 'LCVP';
      if (currentUser.role === 'Team_Leader') return 'Team_Leader';
    }
    return 'Member';
  };

  const toggleCommitteeMenu = () => {
    setIsCommitteeExpanded(!isCommitteeExpanded);
  };

  const toggleProfileMenu = () => {
    setIsProfileExpanded(!isProfileExpanded);
  };

  return (
    <Sidebar className='w-full md:w-64 bg-gray-50 dark:bg-gray-800'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>

          {/* Manage Committee with dropdown */}
          <div className="relative">
            <div 
              onClick={isMobile ? toggleCommitteeMenu : undefined}
              className="cursor-pointer md:cursor-default"
            >
              <Link to='/dashboard?tab=manageCommittee'>
                <Sidebar.Item
                  active={tab === 'manageCommittee'}
                  icon={HiUserGroup}
                  as='div'
                  className={`flex justify-between items-center hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors ${tab === 'manageCommittee' ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
                >
                  <span className="font-medium">Manage Committee</span>
                  {isMobile && (
                    isCommitteeExpanded ? <HiChevronUp className="ml-2 text-gray-500" /> : <HiChevronDown className="ml-2 text-gray-500" />
                  )}
                </Sidebar.Item>
              </Link>
            </div>
            
            {(isCommitteeExpanded || (!isMobile && tab === 'manageCommittee')) && (
              <div className="md:ml-6 md:pl-2 md:border-l-2 md:border-blue-200 dark:md:border-gray-600 space-y-1 mt-1">
                {(currentUser.role === 'LCP' || currentUser.role === 'LCVP' || currentUser.role === 'Team_Leader') && (
                  <Link to='/dashboard?tab=manageCommittee&subtab=member'>
                    <Sidebar.Item
                      active={tab === 'manageCommittee' && location.search.includes('subtab=member')}
                      as='div'
                      className={`pl-8 md:pl-4 text-sm py-2 rounded-lg transition-colors ${tab === 'manageCommittee' && location.search.includes('subtab=member') ? 'bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white' : 'hover:bg-blue-50 dark:hover:bg-gray-700'}`}
                      onClick={() => isMobile && setIsCommitteeExpanded(false)}
                    >
                      Members
                    </Sidebar.Item>
                  </Link>
                )}
                {(currentUser.role === 'LCP') && (
                <>
                  <Link to='/dashboard?tab=manageCommittee&subtab=function'>
                    <Sidebar.Item
                      active={tab === 'manageCommittee' && location.search.includes('subtab=function')}
                      as='div'
                      className={`pl-8 md:pl-4 text-sm py-2 rounded-lg transition-colors ${tab === 'manageCommittee' && location.search.includes('subtab=function') ? 'bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white' : 'hover:bg-blue-50 dark:hover:bg-gray-700'}`}
                      onClick={() => isMobile && setIsCommitteeExpanded(false)}
                    >
                      Functions
                    </Sidebar.Item>
                  </Link>
                </>
                )}
              </div>
            )}
          </div>
          
          {(currentUser.role === 'LCP' || currentUser.role === 'LCVP') && (
            <>
              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item
                  active={tab === 'comments'}
                  icon={HiChatBubbleLeftEllipsis}
                  as='div'
                  className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => {
                    setIsCommitteeExpanded(false);
                    setIsProfileExpanded(false);
                  }}
                >
                  <span className="font-medium">Comments</span>
                </Sidebar.Item>
              </Link>

              <Link to='/dashboard?tab=finance'>
                <Sidebar.Item
                  active={tab === 'finance'}
                  icon={HiCreditCard}
                  as='div'
                  className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => {
                    setIsCommitteeExpanded(false);
                    setIsProfileExpanded(false);
                  }}
                >
                  <span className="font-medium">Finance</span>
                </Sidebar.Item>
              </Link>
            </>
          )}

          {(currentUser.role === 'LCP' || currentUser.role === 'LCVP' || currentUser.role === 'Team_Leader' || currentUser.role === 'Member') && (
              <>
                  <Sidebar.Item
                      active={location.pathname.includes('TaskDashboard')}
                      icon={HiNewspaper}
                      as='div'
                      className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => {
                          if (currentUser && currentUser.id) {
                              switch(currentUser.role) {
                                  case "LCP":
                                      navigate(`/user/${currentUser.id}/TaskDashboard`);
                                      break;
                                  case "LCVP":
                                      navigate(`/user/${currentUser.id}/TaskDashboardLCVP`);
                                      break;
                                  case "Team_Leader":
                                      navigate(`/user/${currentUser.id}/TaskDashboardTL`);
                                      break;
                                  case "Member":
                                      navigate(`/user/${currentUser.id}/TaskDashboardMember`);
                                      break;
                                  default:
                                      navigate("/login");
                              }
                          } else {
                              console.error("No user found in state!");
                              navigate("/login");
                          }
                      }}
                  >
                      <span className="font-medium">Tasks</span>
                  </Sidebar.Item>



              </>
          )}
              <Link to='/dashboard?tab=event'>
                <Sidebar.Item
                  active={tab === 'event'}
                  icon={HiRectangleStack}
                  as='div'
                  className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => {
                    setIsCommitteeExpanded(false);
                    setIsProfileExpanded(false);
                  }}
                >
                  <span className="font-medium">Events</span>
                </Sidebar.Item>
              </Link>

          
          {/* Profile with dropdown */}
          <div className="relative">
            <div 
              onClick={isMobile ? toggleProfileMenu : undefined}
              className="cursor-pointer md:cursor-default"
            >
              <Link to='/dashboard?tab=profile'>
                <Sidebar.Item
                  active={tab === 'profile'}
                  icon={HiUser}
                  label={getUserRoleLabel()}
                  labelColor='dark'
                  as='div'
                  className={`flex justify-between items-center hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors ${tab === 'profile' ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
                >
                  <span className="font-medium">Profile</span>
                  {isMobile && (
                    isProfileExpanded ? <HiChevronUp className="ml-2 text-gray-500" /> : <HiChevronDown className="ml-2 text-gray-500" />
                  )}
                </Sidebar.Item>
              </Link>
            </div>
            
            {(isProfileExpanded || (!isMobile && tab === 'profile')) && (
              <div className="md:ml-6 md:pl-2 md:border-l-2 md:border-blue-200 dark:md:border-gray-600 space-y-1 mt-1">
                <Link to="/dashboard?tab=profile&subtab=password">
                    <Sidebar.Item
                      active={tab === 'profile' && subtab === 'password' }
                      as='div'
                      className={`pl-8 md:pl-4 text-sm py-2 rounded-lg transition-colors ${tab === 'profile' && subtab === 'password' ? 'bg-blue-100 dark:bg-gray-600 text-blue-700 dark:text-white' : 'hover:bg-blue-50 dark:hover:bg-gray-700'}`}
                      onClick={() => isMobile && setIsProfileExpanded(false)}
                    >
                      Update Password
                    </Sidebar.Item>
                  </Link>
              </div>
            )}
          </div>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}