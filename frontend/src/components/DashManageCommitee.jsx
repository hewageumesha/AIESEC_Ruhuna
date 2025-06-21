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
      role: 'lcp',
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    });
    
    // Uncomment to test different roles:
    setCurrentUser(organization.lcp); // LCP
    setCurrentUser(organization.lcvps[0]); // LCVP
    setCurrentUser(organization.lcvps[0].tls[0]); // Team Leader
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AIESEC Local Chapter</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Logged in as: {currentUser.name} ({currentUser.role.toUpperCase()})
          </p>
        </div>
      </div>
      
      {/* Main Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100">Profile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100">Contact</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
            {/* LCP Row */}
            <tr className="bg-blue-50 hover:bg-blue-100 dark:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <RoleBadge role={organization.lcp.role} />
                    <div className="text-xs text-gray-500 mt-1 dark:text-gray-200">2023-2024 Term</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src={organization.lcp.image} alt={organization.lcp.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{organization.lcp.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">Local Committee President</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-300">{organization.lcp.email}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 123-4567</div>
              </td>
            </tr>

            {/* LCVPs */}
            {organization.lcvps.map((lcvp, lcvpIndex) => (
              <React.Fragment key={lcvpIndex}>
                <tr 
                  className="bg-green-50 hover:bg-green-100 cursor-pointer dark:bg-gray-700"
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
                        <div className="text-xs text-gray-500 mt-1 dark:text-gray-200">2023-2024 Term</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={lcvp.image} alt={lcvp.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{lcvp.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Vice President</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">{lcvp.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 987-6543</div>
                  </td>
                </tr>

                {/* TLs - shown when LCVP is expanded */}
                {expandedRows.lcvps.includes(lcvpIndex) && lcvp.tls.map((tl, tlIndex) => (
                  <React.Fragment key={tlIndex}>
                    <tr 
                      className="bg-purple-50 hover:bg-purple-100 cursor-pointer dark:bg-gray-600"
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
                            <div className="text-xs text-gray-500 mt-1 dark:text-gray-200">Team Leader</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={tl.image} alt={tl.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{tl.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">Team Leader</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">{tl.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 456-7890</div>
                      </td>
                    </tr>

                    {/* Members - shown when TL is expanded */}
                    {expandedRows.tls.includes(`${lcvpIndex}-${tlIndex}`) && tl.members.map((member, memberIndex) => (
                      <tr 
                        key={memberIndex} 
                        className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-500"
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
                              <div className="text-xs text-gray-500 mt-1 dark:text-gray-200">Joined {member.joinDate}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={member.image} alt={member.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{member.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-300">Member</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-300">{member.email}</div>
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