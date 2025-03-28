import { Footer } from 'flowbite-react';
import { BsFacebook, BsInstagram, BsYoutube, BsTiktok } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function FooterComponent() {
  return (
    <Footer classname='border-t-8 border-t-blue-400 py-6 w-full text-center'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                <div className=''>
                    <Link to="/" className="flex items-center">
                        <img src='/AiR_logo.png' alt="AIESEC UOR Logo" className="h-10 sm:h-12" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
                    <div>
                    <Footer.Title title="Youth" />
                    <Footer.LinkGroup col>
                        <Footer.Link href="#">Global Talent</Footer.Link>
                        <Footer.Link href="#">Global Teacher</Footer.Link>
                        <Footer.Link href="#">Global Volynteer</Footer.Link>
                        <Footer.Link href="#">Become a member</Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    <Footer.Title title="Organization" />
                    <Footer.LinkGroup col>
                        <Footer.Link href="#">Partner with us</Footer.Link>
                        <Footer.Link href="#">Global Volunteer</Footer.Link>
                        <Footer.Link href="#">Global Talent</Footer.Link>
                        <Footer.Link href="#">Global Teacher</Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    <div>
                    <Footer.Title title="about" />
                    <Footer.LinkGroup col>
                        <Footer.Link href="#" target='_blank' rel='noopener noreferrer'>AIESEC</Footer.Link>
                        <Footer.Link href="https://www.instagram.com/lc_ruhuna/" target='_blank' rel='noopener noreferrer'>AIESEC UOR</Footer.Link>
                        <Footer.Link href="#" target='_blank' rel='noopener noreferrer'>Alumni</Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    <div>
                    <div>
                    <Footer.Title title="Legal" />
                    <Footer.LinkGroup col>
                        <Footer.Link href="#">Privacy Policy</Footer.Link>
                        <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright href="#" by="AIESEC UOR" year={new Date().getFullYear}/>
                <div className="mt-4 flex gap-6 space-x-6 sm:mt-0 sm:justify-center">
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
