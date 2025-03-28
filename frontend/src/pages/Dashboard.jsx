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
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* posts... */}
      {tab === 'manageCommittee' && <DashManageCommitee />}
      {/* users */}
      {tab === 'task' && <DashTask />}
      {/* comments  */}
      {tab === 'event' && <DashEvent />}
      {/* comments  */}
      {tab === 'finance' && <DashFinance />}
      {/* comments  */}
      {tab === 'birthday' && <DashBirthday />}
      {/* dashboard comp */}
      {tab === 'dash' && <DashboardComp />}
    </div>
  );
}