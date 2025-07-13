import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import DashManageMember from './DashManageMember';
import DashManageFunction from './DashManageFunction';

const OrgTable = () => {
  const [organization, setOrganization] = useState({});
  const [subOrganization, setSubOrganization] = useState({});
  const [expandedRows, setExpandedRows] = useState({ lcvps: [], tls: [] });

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const subtab = urlParams.get("subtab");

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const termString = `${currentYear}-${nextYear} Team`;

  useEffect(() => {
    fetchOrganizationData();
  }, [currentUser]);

  const fetchOrganizationData = async () => {
    try {
      const data = await axios.get(`http://localhost:8080/api/users/hierarchy`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const main = data.data[0];
      setOrganization(main);
      if (data.data.length > 1) {
        const sub = data.data[1];
        setSubOrganization(sub);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const toggleLcvp = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      lcvps: prev.lcvps.includes(index)
        ? prev.lcvps.filter((i) => i !== index)
        : [...prev.lcvps, index],
      tls: prev.lcvps.includes(index)
        ? prev.tls.filter((tlIndex) => !tlIndex.startsWith(`${index}-`))
        : prev.tls,
    }));
  };

  const toggleTl = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      tls: prev.tls.includes(index)
        ? prev.tls.filter((i) => i !== index)
        : [...prev.tls, index],
    }));
  };

  // Placeholder permission function
  const canAdd = (currentRole, targetRole) => {
    return currentRole === 'lcp' || currentRole === 'lcvp';
  };

  const RoleBadge = ({ role }) => {
    let bgColor = 'bg-gray-100 text-gray-800 dark:bg-gray-100 dark:text-gray-500';
    if (role === 'lcp') bgColor = 'bg-blue-100 text-blue-800 dark:bg-gray-400 dark:text-gray-900';
    else if (role === 'lcvp') bgColor = 'bg-green-100 text-green-800 dark:bg-gray-300 dark:text-gray-700';
    else if (role === 'team_leader') bgColor = 'bg-purple-100 text-purple-800 dark:bg-gray-200 dark:text-gray-600';

    const roleDisplay = {
      lcp: 'LCP',
      lcvp: 'LCVP',
      team_leader: 'Team Leader',
      member: 'Member',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bgColor}`}>
        {roleDisplay[role] || role}
      </span>
    );
  };

  if (!currentUser) return <div className="p-8 text-center">Loading...</div>;

  if (subtab === 'member') {
    return <DashManageMember />;
  }
  if (subtab === 'function') {
    return <DashManageFunction />;
  }

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Profile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Contact</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            { organization ?.lcp &&
            <tr className="bg-blue-50 hover:bg-blue-100 dark:bg-gray-500 dark:hover:bg-gray-600 ">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <RoleBadge role={organization.lcp.role} />
                    <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">{termString}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src={organization.lcp.image} alt={organization.lcp.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-900">{organization.lcp.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Local Committee President</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-900">{organization.lcp.email}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{organization.lcp.phoneNumber}</div>
              </td>
            </tr>
            }

            { subOrganization ?.lcp &&
            <tr className="bg-blue-50 hover:bg-blue-100  dark:bg-gray-500 dark:hover:bg-gray-600">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <RoleBadge role={subOrganization.lcp.role} />
                    <div className="text-xs text-gray-500 mt-1  dark:text-gray-400">{termString}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src={subOrganization.lcp.image} alt={subOrganization.lcp.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900  dark:text-gray-900">{subOrganization.lcp.name}</div>
                    <div className="text-sm text-gray-500  dark:text-gray-400">Local Committee President</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900  dark:text-gray-900">{subOrganization.lcp.email}</div>
                <div className="text-sm text-gray-500  dark:text-gray-400">{organization.lcp.phoneNumber}</div>
              </td>
            </tr>
            }

            {organization?.lcvps && organization.lcvps.map((lcvp, lcvpIndex) => (
              <React.Fragment key={lcvpIndex}>
                <tr 
                  className="bg-green-50 hover:bg-green-100 cursor-pointer dark:bg-gray-400 dark:hover:bg-gray-500"
                  onClick={() => toggleLcvp(lcvpIndex)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <svg
                          className={`h-5 w-5 text-green-600 transform ${expandedRows.lcvps.includes(lcvpIndex) ? 'rotate-90' : ''}`}
                          viewBox="0 0 20 20"
                          fill="currentColor dark:gray-400"
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
                        <div className="text-xs text-gray-500 mt-1  dark:text-gray-300">{termString}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={lcvp.image} alt={lcvp.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900  dark:text-gray-900">{lcvp.name}</div>
                        <div className="text-sm text-gray-500  dark:text-gray-300">Vice President</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900  dark:text-gray-900">{lcvp.email}</div>
                    <div className="text-sm text-gray-500  dark:text-gray-300">{lcvp.phoneNumber}</div>
                  </td>
                </tr>

                {/* TLs - shown when LCVP is expanded */}
                {expandedRows.lcvps.includes(lcvpIndex) && lcvp.tls.map((tl, tlIndex) => (
                  <React.Fragment key={tlIndex}>
                    <tr 
                      className="bg-purple-50 hover:bg-purple-100 cursor-pointer dark:bg-gray-300 dark:hover:bg-gray-400"
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
                        <div className="text-sm text-gray-500">{tl.phoneNumber}</div>
                      </td>
                    </tr>

                    {/* Members - shown when TL is expanded */}
                    {expandedRows.tls.includes(`${lcvpIndex}-${tlIndex}`) && tl.members.map((member, memberIndex) => (
                      <tr 
                        key={memberIndex} 
                        className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-200 dark:hover:bg-gray-300"
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
                          <div className="text-sm text-gray-500">{member.phoneNumber}</div>
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
