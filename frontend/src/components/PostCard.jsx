import { Link } from 'react-router-dom';

export default function PostCard({ event, task }) {
  return (
    <>
      {/* Event Card */}
      <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all mx-auto'>
        <Link to={`/event/${event.slug}`}>
          <img
            src={event.image}
            alt='event cover'
            className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
          />
        </Link>
        <div className='p-3 flex flex-col gap-2'>
          <p className='text-lg font-semibold line-clamp-2'>{event.title}</p>
          <Link
            to={`/event/${event.slug}`}
            className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
          >
            Read Event
          </Link>
        </div>
      </div>

      {/* Task Card */}
      <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all mx-auto'>
        <Link to={`/task/${task.slug}`}>
          <img
            src={task.image}
            alt='task cover'
            className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
          />
        </Link>
        <div className='p-3 flex flex-col gap-2'>
          <p className='text-lg font-semibold line-clamp-2'>{task.title}</p>
          <Link
            to={`/task/${task.slug}`} 
            className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
          >
            Read Task
          </Link>
        </div>
      </div>
    </>
  );
}
