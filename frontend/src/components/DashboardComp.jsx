import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiNewspaper,
  HiArrowNarrowUp,
  HiRectangleStack,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthTasks, setLastMonthTasks] = useState(0);
  const [lastMonthEvents, setLastMonthEvents] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/task/gettasks?limit=5');
        const data = await res.json();
        if (res.ok) {
          setTasks(data.tasks);
          setTotalTasks(data.totalTasks);
          setLastMonthTasks(data.lastMonthTasks);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/event/geteventss?limit=5');
        const data = await res.json();
        if (res.ok) {
          setEvents(data.events);
          setTotalEvents(data.totalEvents);
          setLastMonthEvents(data.lastMonthEvents);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if ((currentUser.isAdmin || currentUser.role === 'lcp') || currentUser.role === 'lcvp' || currentUser.role === 'tl') {
      fetchUsers();
      fetchTasks();
      fetchEvents();
    }
  }, [currentUser]);
  return (
    <div className='p-3 md:mx-auto'>
        <div className='flex-wrap flex gap-4 justify-center'>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                <div className='flex justify-between'>
                    <div className=''>
                    <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                    <p className='text-2xl'>{totalUsers}</p>
                    </div>
                    <HiOutlineUserGroup className='bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                </div>
                <div className='flex  gap-2 text-sm'>
                    <span className='text-red-400 flex items-center'>
                    <HiArrowNarrowUp />
                    {lastMonthUsers}
                    </span>
                    <div className='text-gray-500'>Last month</div>
                </div>
            </div>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                <div className='flex justify-between'>
                    <div className=''>
                        <h3 className='text-gray-500 text-md uppercase'>
                            Total Tasks
                        </h3>
                        <p className='text-2xl'>{totalTasks}</p>
                    </div>
                    <HiNewspaper className='bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                </div>
                <div className='flex  gap-2 text-sm'>
                    <span className='text-red-400 flex items-center'>
                    <HiArrowNarrowUp />
                    {lastMonthTasks}
                    </span>
                    <div className='text-gray-500'>Last month</div>
                </div>
            </div>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                <div className='flex justify-between'>
                    <div className=''>
                    <h3 className='text-gray-500 text-md uppercase'>Total Event</h3>
                    <p className='text-2xl'>{totalEvents}</p>
                    </div>
                    <HiRectangleStack className='bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                </div>
                <div className='flex  gap-2 text-sm'>
                    <span className='text-red-400 flex items-center'>
                    <HiArrowNarrowUp />
                    {lastMonthEvent}
                    </span>
                    <div className='text-gray-500'>Last month</div>
                </div>
            </div>
        </div>
        <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                <div className='flex justify-between  p-3 text-sm font-semibold'>
                    <h1 className='text-center p-2'>Task</h1>
                    <Button outline gradientDuoTone='purpleToBlue'>
                    <Link to={'/dashboard?task'}>See all</Link>
                    </Button>
                </div>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Task name</Table.HeadCell>
                        <Table.HeadCell>Date</Table.HeadCell>
                    </Table.Head>
                    {tasks && tasks.map((task) => (
                        <Table.Body key={task._id} className='divide-y'>
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                <Table.Cell className='w-96'>
                                    <p className='line-clamp-2'>{task.name}</p>
                                </Table.Cell>
                                <Table.Cell>
                                    {tasks.date}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            </div>
            
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                <div className='flex justify-between  p-3 text-sm font-semibold'>
                    <h1 className='text-center p-2'>Recent Event</h1>
                    <Button outline gradientDuoTone='purpleToBlue'>
                    <Link to={'/dashboard?tab=events'}>See all</Link>
                    </Button>
                </div>
                <Table hoverable>
                    <Table.Head>
                    <Table.HeadCell>Event image</Table.HeadCell>
                    <Table.HeadCell>Event Title</Table.HeadCell>
                    <Table.HeadCell>Date</Table.HeadCell>
                    </Table.Head>
                    {events && events.map((event) => (
                        <Table.Body key={post._id} className='divide-y'>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>
                            <img
                                src={event.image}
                                alt='event'
                                className='w-14 h-10 rounded-md bg-gray-500'
                            />
                            </Table.Cell>
                            <Table.Cell className='w-96'>{event.title}</Table.Cell>
                            <Table.Cell className='w-5'>{event.date}</Table.Cell>
                        </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            </div>
        </div>
    </div>
  );
}