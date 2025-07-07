import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashManageCommitee from '../components/DashManageCommitee';
import DashTask from '../components/DashTask';
import DashEvent from '../components/DashEvent';
import DashFinance from '../components/DashFinance';
import DashBirthday from '../components/DashBirthday';
import DashboardComp from '../components/DashboardComp';
import DashComments from '../components/DashComments';
import DashManageMember from '../components/DashManageMember';
import UpdatePassword from '../components/UpdatePassword';
import React from 'react';

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
        {subtab === 'members' && <DashManageMember />}
      </DashManageCommitee>
    ),
    comments: <DashComments />,
    task: <DashTask />,
    event: <DashEvent />,
    finance: <DashFinance />,
    birthday: <DashBirthday />,
    dash: <DashboardComp />,
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
