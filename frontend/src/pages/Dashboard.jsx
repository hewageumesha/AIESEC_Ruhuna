import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashManageCommitee from '../components/DashManageCommitee';
import DashTask from '../components/DashTask';
import DashEvent from '../components/DashEvent';
import DashBirthday from '../components/DashBirthday';
import DashboardComp from '../components/DashboardComp';
import DashComments from '../components/DashComments';
import DashManageMember from '../components/DashManageMember';
import UpdatePassword from '../components/UpdatePassword';
import DashManageFunction from '../components/DashManageFunction';
import React from 'react';
import DashSessionLogs from '../components/DashSessionLogs';
import DashManageDepartment from '../components/DashManageDepartment';
import DashProject from '../components/DashProject';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('dash');
  const [subtab, setSubtab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    const subtabFromUrl = urlParams.get('subtab');

    setTab(tabFromUrl || 'dash');
    setSubtab(subtabFromUrl || '');
  }, [location.search]);

  const tabComponents = {
    profile: (
      <DashProfile>
        {subtab === 'password' && <UpdatePassword />}
      </DashProfile>
    ),
    manageCommittee: (
      <DashManageCommitee>
        {subtab === 'member' && <DashManageMember />}
        {subtab === 'function' && <DashManageFunction />}
        {subtab === 'department' && <DashManageDepartment />}
      </DashManageCommitee>
    ),
    project: <DashProject />,
    task: <DashTask />,
    event: <DashEvent />,
    birthday: <DashBirthday />,
    comments: <DashComments />,
    sessionLogs: <DashSessionLogs />,
    dash: <DashboardComp />
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar tab={tab} subtab={subtab} />
      </div>
      <div className="flex-1 p-4">
        {tabComponents[tab] || <DashboardComp />}
      </div>
    </div>
  );
}
