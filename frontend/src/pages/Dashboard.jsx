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

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('dash'); // Default to Dashboard

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Object mapping for better readability
  const tabComponents = {
    profile: <DashProfile />,
    manageCommittee: <DashManageCommitee />,
    task: <DashTask />,
    event: <DashEvent />,
    finance: <DashFinance />,
    birthday: <DashBirthday />,
    dash: <DashboardComp />, // Default Dashboard
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Content */}
      <div className="flex-1 p-4">
        {tabComponents[tab] || <DashboardComp />} {/* Default to DashboardComp if the tab is invalid */}
      </div>
    </div>
  );
}
