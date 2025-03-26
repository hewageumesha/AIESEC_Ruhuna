import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);

    const handleSignout = async () => {
        try {
          const res = await fetch('/api/user/signout', {
            method: 'POST',
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            dispatch(signoutSuccess());
          }
        } catch (error) {
          console.log(error.message);
        }
    };
    
    return (
    <Navbar className='border-b-2'>
        <Link to="/" className="flex items-center">
            <img src='/AiR_logo.png' alt="AIESEC UOR Logo" className="h-10 sm:h-12" />
        </Link>
        <div className='flex gap-3 md:order-2'>
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
                {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>
            {currentUser ? (
                    <Dropdown
                        arrowIcon = {false}
                        inline
                        label = {
                            <Avatar 
                            alt = 'user'
                            img = {currentUser.profilePicture}
                            rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>@{currentUser.username}</span>
                            <span className='block text-sm font-medium truncate'>
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
                    </Dropdown>
                ): 
                (
                    <Link to='/sign-in'>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </Link>
                )
            }
            <Navbar.Toggle />
        </div>
        <Navbar.Collapse className='font-semibold'>
            <Navbar.Link active={path === '/'} as={'div'}>
                <Link to="/" className='font-semibold'>
                    Home
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/about'} as={'div'}>
                <Link to="/about" className='font-semibold'>
                    About
                </Link>
            </Navbar.Link >
            <Navbar.Link active={path === '/gallery'} as={'div'}>
                <Link to="/gallery" className='font-semibold'>
                    Gallery
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  );
}
