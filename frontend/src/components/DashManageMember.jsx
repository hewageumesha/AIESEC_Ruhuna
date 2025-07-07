import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  HiPlus, HiPencil, HiTrash, HiChevronDown, HiChevronUp,
  HiUserGroup, HiUserCircle, HiOutlineUserAdd, HiOutlineUserRemove
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import MemberModal from '../components/MemberModal';
import ConfirmModal from '../components/ConfirmModal';

const DashManageMember = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const { members, loading, error } = useSelector((state) => state.committee);
  
  const [activeTab, setActiveTab] = useState('members');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedTeams, setExpandedTeams] = useState([]);
  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    member: null,
    isLoading: false,
  });

  // Extract subtab from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subtab = params.get('subtab') || 'members';
    setActiveTab(subtab);
  }, [location.search]);

  // Fetch committee data
  useEffect(() => {
    dispatch(fetchCommittee());
  }, [dispatch]);

  // Permission checks
  const isLCP = currentUser?.role === 'LCP';
  const isLCVP = currentUser?.role === 'LCVP';
  const isTeamLeader = currentUser?.role === 'Team_Leader';

  // Filter members based on current user's permissions and active tab
  const filteredMembers = members.filter(member => {
    // Filter by tab first
    if (activeTab === 'lCVPs' && member.role !== 'LCVP') return false;
    if (activeTab === 'teamLeaders' && member.role !== 'Team_Leader') return false;
    if (activeTab === 'members' && member.role !== 'Member') return false;

    // Then filter by permissions
    if (isLCP) return true;
    if (isLCVP) {
      return member.department === currentUser.department && 
             (member.role === 'Member' || member.role === 'Team_Leader');
    }
    if (isTeamLeader) {
      return member.team === currentUser.team && member.role === 'Member';
    }
    return false;
  });

  // Group members by team
  const teams = {};
  filteredMembers.forEach(member => {
    if (!teams[member.team]) {
      teams[member.team] = [];
    }
    teams[member.team].push(member);
  });

  const toggleTeam = (teamName) => {
    setExpandedTeams(prev => 
      prev.includes(teamName) 
        ? prev.filter(t => t !== teamName) 
        : [...prev, teamName]
    );
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (member) => {
    setDeleteState({
      isOpen: true,
      member,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await dispatch(deleteMember(deleteState.member._id)).unwrap();
      
      toast.success(
        <div>
          <p className="font-semibold">Successfully deleted member!</p>
          <p className="text-sm">{deleteState.member.name} has been removed.</p>
        </div>, 
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: '✅',
        }
      );
      
      setDeleteState({
        isOpen: false,
        member: null,
        isLoading: false,
      });
      
      // Refresh the member list
      dispatch(fetchCommittee());
    } catch (error) {
      toast.error(
        <div>
          <p className="font-semibold">Deletion failed</p>
          <p className="text-sm">{error.message || 'Please try again later.'}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: '❌',
        }
      );
      setDeleteState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteState({
      isOpen: false,
      member: null,
      isLoading: false,
    });
  };

  // Check if user can perform actions on a member
  const canEditMember = (member) => {
    if (isLCP) return true;
    if (isLCVP) {
      return member.role === 'Member' || 
             (member.role === 'Team_Leader' && member.department === currentUser.department);
    }
    if (isTeamLeader) {
      return member.role === 'Member' && member.team === currentUser.team;
    }
    return false;
  };

  const canDeleteMember = (member) => {
    if (isLCP) return true;
    if (isLCVP) {
      return member.role === 'Member' || 
             (member.role === 'Team_Leader' && member.department === currentUser.department);
    }
    if (isTeamLeader) {
      return member.role === 'Member' && member.team === currentUser.team;
    }
    return false;
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'LCP':
        return <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">LCP</span>;
      case 'LCVP':
        return <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">LCVP</span>;
      case 'Team_Leader':
        return <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Team Leader</span>;
      default:
        return <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Member</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Committee Management</h1>
          {isLCP && (
            <div className="flex flex-wrap gap-2">
              <Link 
                to="/dashboard?tab=manageCommittee&subtab=departments"
                className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                  activeTab === 'departments' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Departments
              </Link>
              <Link 
                to="/dashboard?tab=manageCommittee&subtab=roles"
                className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                  activeTab === 'roles' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Roles
              </Link>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <Link
                to="/dashboard?tab=manageCommittee&subtab=members"
                className={`py-3 px-4 md:py-4 md:px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'members' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Members
              </Link>
              {isLCP && (
                <Link
                  to="/dashboard?tab=manageCommittee&subtab=lCVPs"
                  className={`py-3 px-4 md:py-4 md:px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'lCVPs' 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  LCVPs
                </Link>
              )}
              {(isLCP || isLCVP) && (
                <Link
                  to="/dashboard?tab=manageCommittee&subtab=teamLeaders"
                  className={`py-3 px-4 md:py-4 md:px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'teamLeaders' 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Team Leaders
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Action Bar */}
          <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-medium text-gray-800">
              {activeTab === 'members' && 'All Members'}
              {activeTab === 'lCVPs' && 'LCVPs'}
              {activeTab === 'teamLeaders' && 'Team Leaders'}
            </h2>
            <button
              onClick={() => {
                setSelectedMember(null);
                setIsModalOpen(true);
              }}
              className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
              disabled={
                (activeTab === 'lCVPs' && !isLCP) ||
                (activeTab === 'teamLeaders' && !(isLCP || isLCVP))
              }
            >
              <HiPlus className="mr-1 md:mr-2" />
              Add {activeTab === 'members' ? 'Member' : activeTab === 'lCVPs' ? 'LCVP' : 'Team Leader'}
            </button>
          </div>

          {/* Members List */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading members...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-500 font-medium">Error loading members</p>
                <p className="text-gray-600 mt-1">{error}</p>
                <button 
                  onClick={() => dispatch(fetchCommittee())}
                  className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Retry
                </button>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-6 text-center">
                <HiOutlineUserRemove className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'members' 
                    ? 'Get started by adding a new member.' 
                    : activeTab === 'lCVPs' 
                      ? 'No LCVPs found in your organization.' 
                      : 'No team leaders found in your department.'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setSelectedMember(null);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <HiOutlineUserAdd className="-ml-1 mr-2 h-5 w-5" />
                    Add {activeTab === 'members' ? 'Member' : activeTab === 'lCVPs' ? 'LCVP' : 'Team Leader'}
                  </button>
                </div>
              </div>
            ) : (
              Object.entries(teams).map(([teamName, teamMembers]) => (
                <div key={teamName} className="bg-gray-50">
                  {/* Team Header */}
                  <div 
                    className="px-4 md:px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleTeam(teamName)}
                  >
                    <div className="flex items-center">
                      <HiUserGroup className="text-gray-500 mr-2 md:mr-3" />
                      <h3 className="font-medium text-gray-800 text-sm md:text-base">{teamName}</h3>
                      <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                        {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    {expandedTeams.includes(teamName) ? (
                      <HiChevronUp className="text-gray-500" />
                    ) : (
                      <HiChevronDown className="text-gray-500" />
                    )}
                  </div>

                  {/* Team Members */}
                  {expandedTeams.includes(teamName) && (
                    <div className="pl-12 md:pl-16 pr-4 md:pr-6 divide-y divide-gray-200">
                      {teamMembers.map((member) => (
                        <div key={member._id} className="py-3 md:py-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <HiUserCircle className="text-gray-400 mr-2 md:mr-3 text-xl md:text-2xl" />
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium text-gray-800 text-sm md:text-base">
                                  {member.name}
                                </h4>
                                {getRoleBadge(member.role)}
                              </div>
                              <p className="text-xs md:text-sm text-gray-500">{member.email}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {member.department} • Joined {new Date(member.joinDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1 md:space-x-2">
                            {canEditMember(member) && (
                              <button
                                onClick={() => handleEdit(member)}
                                className="p-1 md:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                                title="Edit member"
                              >
                                <HiPencil className="text-sm md:text-base" />
                              </button>
                            )}
                            {canDeleteMember(member) && (
                              <button
                                onClick={() => handleDeleteClick(member)}
                                className="p-1 md:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                                title="Delete member"
                                disabled={deleteState.isLoading}
                              >
                                <HiTrash className="text-sm md:text-base" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteState.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={
          <div>
            <p className="mb-2">Are you sure you want to delete <strong>{deleteState.member?.name}</strong>?</p>
            <p className="text-sm text-red-600">This action is permanent and cannot be undone.</p>
            {deleteState.member?.role === 'LCVP' && (
              <p className="mt-2 text-sm text-yellow-600">
                <strong>Warning:</strong> Deleting an LCVP will also remove their access to all team management features.
              </p>
            )}
          </div>
        }
        confirmText={deleteState.isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Deleting...
          </>
        ) : "Yes, Delete"}
        confirmColor="red"
        isLoading={deleteState.isLoading}
      />

      {/* Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember}
        currentUserRole={currentUser?.role}
        currentUserDepartment={currentUser?.department}
        currentUserTeam={currentUser?.team}
        mode={activeTab === 'lCVPs' ? 'LCVP' : activeTab === 'teamLeaders' ? 'Team_Leader' : 'Member'}
      />
    </div>
  );
};

export default DashManageMember;