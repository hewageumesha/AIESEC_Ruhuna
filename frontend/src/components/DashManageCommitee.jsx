import React, { useState, useEffect } from 'react';

// Mock authentication context
const AuthContext = React.createContext();

const OrgTable = () => {
  // Sample data
  const organization = {
    lcp: {
      id: 'user-1',
      name: "John Doe",
      role: "lcp",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      email: "john.doe@aiesec.org",
      tenure: "2023-2024"
    },
    lcvps: [
      {
        id: 'user-2',
        name: "Alice Smith",
        role: "lcvp",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        email: "alice.smith@aiesec.org",
        tenure: "2023-2024",
        tls: [
          {
            id: 'user-3',
            name: "Bob Johnson",
            role: "team_leader",
            image: "https://randomuser.me/api/portraits/men/2.jpg",
            email: "bob.johnson@aiesec.org",
            members: Array(6).fill().map((_, i) => ({
              id: `user-m1-${i}`,
              name: `Member ${i+1}`,
              role: "member",
              image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i+3}.jpg`,
              email: `member${i+1}.bd@aiesec.org`,
              joinDate: `2023-0${i+1}-15`
            }))
          },
          {
            id: 'user-4',
            name: "Charlie Brown",
            role: "team_leader",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            email: "charlie.brown@aiesec.org",
            members: Array(6).fill().map((_, i) => ({
              id: `user-m2-${i}`,
              name: `Member ${i+7}`,
              role: "member",
              image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i+9}.jpg`,
              email: `member${i+7}.sr@aiesec.org`,
              joinDate: `2023-0${i+3}-01`
            }))
          }
        ]
      },
      {
        id: 'user-5',
        name: "Ethan Hunt",
        role: "lcvp",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        email: "ethan.hunt@aiesec.org",
        tenure: "2023-2024",
        tls: Array(2).fill().map((_, i) => ({
          id: `user-6-${i}`,
          name: `TL ${i+1}`,
          role: "team_leader",
          image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i+20}.jpg`,
          email: `tl${i+1}.tm@aiesec.org`,
          members: Array(3).fill().map((_, j) => ({
            id: `user-m3-${i}-${j}`,
            name: `Member ${i*3 + j + 1}`,
            role: "member",
            image: `https://randomuser.me/api/portraits/${j % 2 === 0 ? 'men' : 'women'}/${i*3 + j + 25}.jpg`,
            email: `member${i*3 + j + 1}.tm@aiesec.org`,
            joinDate: `2023-0${i+j+2}-10`
          }))
        }))
      }
    ]
  };

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState({
    lcvps: [],
    tls: []
  });

  // Mock current user (in a real app, this would come from authentication)
  const [currentUser, setCurrentUser] = useState();
  
  // Simulate login (in a real app, this would be handled by auth system)
  useEffect(() => {
    // Default to member view
    setCurrentUser({
      id: 'user-m1-0',
      name: 'Member 1',
      role: 'team_leader',
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    });
    
    // Uncomment to test different roles:
    setCurrentUser(organization.lcp); // LCP
    setCurrentUser(organization.lcvps[0]); // LCVP
    setCurrentUser(organization.lcvps[0].tls[0]); // Team Leader
  }, []);

  // Permission checks
  const canView = (userRole, targetRole) => {
    return true; // All roles can view hierarchy
  };

  const canEdit = (userRole, targetRole) => {
    if (userRole === 'lcp') return true;
    if (userRole === 'lcvp') return targetRole !== 'lcp';
    if (userRole === 'team_leader') return targetRole === 'member';
    return false;
  };

  const canDelete = (userRole, targetRole) => {
    return canEdit(userRole, targetRole); // Same rules as edit
  };

  const canAdd = (userRole, targetRole) => {
    if (userRole === 'lcp') return true;
    if (userRole === 'lcvp') return targetRole !== 'lcp';
    if (userRole === 'team_leader') return targetRole === 'member';
    return false;
  };

  const toggleLcvp = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      lcvps: prev.lcvps.includes(index) 
        ? prev.lcvps.filter(i => i !== index)
        : [...prev.lcvps, index],
      tls: prev.lcvps.includes(index) 
        ? prev.tls.filter(tlIndex => !tlIndex.startsWith(`${index}-`))
        : prev.tls
    }));
  };

  const toggleTl = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      tls: prev.tls.includes(index) 
        ? prev.tls.filter(i => i !== index)
        : [...prev.tls, index]
    }));
  };

  // Action buttons component with permission checks
  const ActionButtons = ({ userRole, targetRole, onEdit, onDelete, onView, onAdd }) => (
    <div className="flex space-x-2">
      {canView(userRole, targetRole) && (
        <button 
          onClick={(e) => { e.stopPropagation(); onView(); }}
          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </button>
      )}
      {canEdit(userRole, targetRole) && (
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      )}
      {canDelete(userRole, targetRole) && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      )}
    </div>
  );

  // Role badge component
  const RoleBadge = ({ role }) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    if (role === 'lcp') bgColor = 'bg-blue-100 text-blue-800';
    else if (role === 'lcvp') bgColor = 'bg-green-100 text-green-800';
    else if (role === 'team_leader') bgColor = 'bg-purple-100 text-purple-800';
    
    const roleDisplay = {
      'lcp': 'LCP',
      'lcvp': 'LCVP',
      'team_leader': 'Team Leader',
      'member': 'Member'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bgColor}`}>
        {roleDisplay[role] || role}
      </span>
    );
  };

  // Add member button with permission check
  const AddMemberButton = ({ targetRole, onClick }) => {
    if (!canAdd(currentUser?.role, targetRole)) return null;
    
    return (
      <button 
        onClick={onClick}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add {targetRole === 'member' ? 'Member' : targetRole.toUpperCase()}
      </button>
    );
  };

  if (!currentUser) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AIESEC Local Chapter</h1>
          <p className="text-gray-600">
            Logged in as: {currentUser.name} ({currentUser.role.toUpperCase()})
          </p>
        </div>
        <div className="space-x-2">
          {/* Add buttons for different roles based on permissions */}
          {canAdd(currentUser.role, 'lcp') && (
            <AddMemberButton 
              targetRole="lcp" 
              onClick={() => alert('Add new LCP')} 
            />
          )}
          {canAdd(currentUser.role, 'lcvp') && (
            <AddMemberButton 
              targetRole="lcvp" 
              onClick={() => alert('Add new LCVP')} 
            />
          )}
          {canAdd(currentUser.role, 'team_leader') && (
            <AddMemberButton 
              targetRole="team_leader" 
              onClick={() => alert('Add new Team Leader')} 
            />
          )}
          {canAdd(currentUser.role, 'member') && (
            <AddMemberButton 
              targetRole="member" 
              onClick={() => alert('Add new Member')} 
            />
          )}
        </div>
      </div>
      
      {/* Main Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* LCP Row */}
            <tr className="bg-blue-50 hover:bg-blue-100">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <RoleBadge role={organization.lcp.role} />
                    <div className="text-xs text-gray-500 mt-1">2023-2024 Term</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src={organization.lcp.image} alt={organization.lcp.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{organization.lcp.name}</div>
                    <div className="text-sm text-gray-500">Local Committee President</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{organization.lcp.email}</div>
                <div className="text-sm text-gray-500">+1 (555) 123-4567</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ActionButtons 
                  userRole={currentUser.role}
                  targetRole={organization.lcp.role}
                  onView={() => alert(`View LCP: ${organization.lcp.name}`)}
                  onEdit={() => alert(`Edit LCP: ${organization.lcp.name}`)}
                  onDelete={() => alert(`Delete LCP: ${organization.lcp.name}`)}
                />
              </td>
            </tr>

            {/* LCVPs */}
            {organization.lcvps.map((lcvp, lcvpIndex) => (
              <React.Fragment key={lcvpIndex}>
                <tr 
                  className="bg-green-50 hover:bg-green-100 cursor-pointer"
                  onClick={() => toggleLcvp(lcvpIndex)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <svg
                          className={`h-5 w-5 text-green-600 transform ${expandedRows.lcvps.includes(lcvpIndex) ? 'rotate-90' : ''}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <RoleBadge role={lcvp.role} />
                        <div className="text-xs text-gray-500 mt-1">2023-2024 Term</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={lcvp.image} alt={lcvp.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{lcvp.name}</div>
                        <div className="text-sm text-gray-500">Vice President</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lcvp.email}</div>
                    <div className="text-sm text-gray-500">+1 (555) 987-6543</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ActionButtons 
                      userRole={currentUser.role}
                      targetRole={lcvp.role}
                      onView={() => alert(`View LCVP: ${lcvp.name}`)}
                      onEdit={() => alert(`Edit LCVP: ${lcvp.name}`)}
                      onDelete={() => alert(`Delete LCVP: ${lcvp.name}`)}
                    />
                  </td>
                </tr>

                {/* TLs - shown when LCVP is expanded */}
                {expandedRows.lcvps.includes(lcvpIndex) && lcvp.tls.map((tl, tlIndex) => (
                  <React.Fragment key={tlIndex}>
                    <tr 
                      className="bg-purple-50 hover:bg-purple-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTl(`${lcvpIndex}-${tlIndex}`);
                      }}
                    >
                      <td className="px-12 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-lg mr-3">
                            <svg
                              className={`h-5 w-5 text-purple-600 transform ${expandedRows.tls.includes(`${lcvpIndex}-${tlIndex}`) ? 'rotate-90' : ''}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <RoleBadge role={tl.role} />
                            <div className="text-xs text-gray-500 mt-1">Team Leader</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={tl.image} alt={tl.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{tl.name}</div>
                            <div className="text-sm text-gray-500">Team Leader</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tl.email}</div>
                        <div className="text-sm text-gray-500">+1 (555) 456-7890</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ActionButtons 
                          userRole={currentUser.role}
                          targetRole={tl.role}
                          onView={() => alert(`View TL: ${tl.name}`)}
                          onEdit={() => alert(`Edit TL: ${tl.name}`)}
                          onDelete={() => alert(`Delete TL: ${tl.name}`)}
                        />
                      </td>
                    </tr>

                    {/* Members - shown when TL is expanded */}
                    {expandedRows.tls.includes(`${lcvpIndex}-${tlIndex}`) && tl.members.map((member, memberIndex) => (
                      <tr 
                        key={memberIndex} 
                        className="bg-gray-50 hover:bg-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <td className="px-20 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-lg mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <RoleBadge role={member.role} />
                              <div className="text-xs text-gray-500 mt-1">Joined {member.joinDate}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={member.image} alt={member.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">Team Member</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.email}</div>
                          <div className="text-sm text-gray-500">Member</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ActionButtons 
                            userRole={currentUser.role}
                            targetRole={member.role}
                            onView={() => alert(`View Member: ${member.name}`)}
                            onEdit={() => alert(`Edit Member: ${member.name}`)}
                            onDelete={() => alert(`Delete Member: ${member.name}`)}
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrgTable;