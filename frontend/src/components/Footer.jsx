import { Footer } from 'flowbite-react';
import { BsFacebook, BsInstagram, BsYoutube, BsTiktok } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function FooterComponent() {
    return (
        <Footer container className='border-t-8 border-t-blue-400 py-4 w-full text-center'>
            <div className='w-full max-w-7xl mx-auto'>
                <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                    <div className=''>
                        <Link to="/" className="flex items-center">
                            <img src='/AiR_logo.png' alt="AIESEC UOR Logo" className="h-10 sm:h-14" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                        <div>
                            <Footer.Title title="Youth" />
                            <Footer.LinkGroup col>
                                <Footer.Link> <Link to="global-intern">Global Talent</Link></Footer.Link>
                                <Footer.Link> <Link to="global-teacher">Global Teacher</Link></Footer.Link>
                                <Footer.Link> <Link to="global-volunteer">Global Volunteer</Link></Footer.Link>
                                <Footer.Link> <Link to="become-member">Become a member</Link></Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title=" " />
                            <Footer.LinkGroup col>
                                <Footer.Link> <Link to="about"> About us </Link></Footer.Link>
                                <Footer.Link href='https://blog.aiesec.org/category/press/'>Press</Footer.Link>
                                <Footer.Link href="https://aiesec-alumni.org/">Alumni</Footer.Link>
                                
                            </Footer.LinkGroup>
                        </div> 
                        <div>
                            <Footer.Title title=" " />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#" target='_blank' rel='noopener noreferrer'>Help</Footer.Link>
                                <Footer.Link >Partner with us</Footer.Link>
                            </Footer.LinkGroup>
                        </div> 
                    </div>      
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="AIESEC UOR" year={new Date().getFullYear()} />
                    <div className="mt-4 flex gap-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="https://www.facebook.com/AIESECLK" icon={BsFacebook} />
                        <Footer.Icon href="https://www.instagram.com/aiesecinsrilanka/" icon={BsInstagram} />
                        <Footer.Icon href="https://www.youtube.com/@AIESECinSriLanka" icon={BsYoutube} />
                        <Footer.Icon href="https://www.tiktok.com/@aiesecinsrilanka" icon={BsTiktok} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}
