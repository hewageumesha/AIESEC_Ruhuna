/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from "react"; // Add necessary imports
import { Link } from "react-router-dom";
import ThemeToggleButton from "../Contexts/ThemeToggleButton";
import { ThemeContext } from "../Contexts/ThemeContext"; // Adjust path if needed


const Home = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div>
            <nav className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <img alt="AIESEC logo" className="h-10 w-10 mr-2" height="50" src="https://storage.googleapis.com/a1aa/image/O6Ihmlu7hPVIbvKgFUwU4KwtgLZNEXEQB4pr06rHbOo.jpg" width="50" />
                        <span className="font-bold text-xl">AIESEC in Ruhuna</span>
                    </div>
                    <ul className="flex space-x-4 text-2xl">
                        <li><a className="hover:underline" href="#">Home</a></li>
                        <li><a className="hover:underline" href="#">About</a></li>
                        <li><a className="hover:underline" href="#">Events</a></li>
                        <li><a className="hover:underline" href="#">Gallery</a></li>
                        <li><a className="hover:underline" href="/login">Login</a></li>
                    </ul>
                    <div>
                        <button onClick={toggleTheme} className="flex space-x-4 text-2xl">
                            {theme === "light" ? "🌙 " : "☀️ "}
                        </button>
                    </div>
                </div>
            </nav>

            <section className="relative">
                <img alt="A large banner showcasing AIESEC activities" className="w-full h-96 object-cover" height="600" src="https://storage.googleapis.com/a1aa/image/Zz3TgsrjiHVksKO164BZWD3TjMByY5rl7geJN0XnsKM.jpg" width="1920" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-bold">Welcome to AIESEC in Ruhuna</h1>
                        <p className="mt-4 text-xxl">Empowering young people for a better future</p>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-gray-100">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Recent Events</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <img alt="Image of a recent AIESEC event 1" className="w-full h-48 object-cover" height="200" src="https://storage.googleapis.com/a1aa/image/B5t4BGrfYw7YlHKbhJLpHH2biY9GFADRPY9OGcxBb4s.jpg" width="300" />
                        <img alt="Image of a recent AIESEC event 2" className="w-full h-48 object-cover" height="200" src="https://storage.googleapis.com/a1aa/image/jFSB6T7WcjleVrLvqzss79WodpJXCMQ7MfPX4Pln_vc.jpg" width="300" />
                        <img alt="Image of a recent AIESEC event 3" className="w-full h-48 object-cover" height="200" src="https://storage.googleapis.com/a1aa/image/UOXLduJaCdq043Pk2Gh4XUztIvfiUQ9g8nUVvutB7nU.jpg" width="300" />
                        <img alt="Image of a recent AIESEC event 4" className="w-full h-48 object-cover" height="200" src="https://storage.googleapis.com/a1aa/image/C007LUwEXdiCipiHqSo1as8ddcpIjnLGch9yOk3qwzY.jpg" width="300" />
                        <img alt="Image of a recent AIESEC event 5" className="w-full h-48 object-cover" height="200" src="https://storage.googleapis.com/a1aa/image/WuyShKPQfo2dzC-vRSFiAoYt743LAtp_2fFu57yEalc.jpg" width="300" />
                        <img alt="Image of a recent AIESEC event 6" className="w-full h-48 object-cover" height="200" src="https://storage.googleapis.com/a1aa/image/_b3xNe4GuomrpuF374dOn86QDVEab7oM0CnCJ-kfCNw.jpg" width="300" />
                        <img alt="Image of a recent AIESEC event 7" className="w-full h-48 object-cover" height="200" src="https://storage.googleapis.com/a1aa/image/_iIVDCmP3ormhSrn4FVdlJvvtqTRLpm1xOIK9e4Q-zQ.jpg" width="300" />
                        <img alt="Image of a recent AIESEC event 8" className="w-full h-48 object-cover" height="200" src="https://storage.googleapis.com/a1aa/image/FBlXj2Ncu6-Cq1yIl2fgGDY4I46Q9btpMl0jKss1Nm4.jpg" width="300" />
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">About AIESEC in Ruhuna</h2>
                    <p className="text-lg">AIESEC in Ruhuna is dedicated to empowering young people to make a positive impact on society. Our mission is to develop leadership skills through cross-cultural exchanges and professional experiences.</p>
                </div>
            </section>

            <section className="py-12 bg-gray-100">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-2">Event Title 1</h3>
                            <p className="text-gray-700 mb-4">Date: 2023-10-01</p>
                            <a className="text-blue-600 hover:underline" href="#">View More</a>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-2">Event Title 2</h3>
                            <p className="text-gray-700 mb-4">Date: 2023-10-15</p>
                            <a className="text-blue-600 hover:underline" href="#">View More</a>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-2">Event Title 3</h3>
                            <p className="text-gray-700 mb-4">Date: 2023-11-01</p>
                            <a className="text-blue-600 hover:underline" href="#">View More</a>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-blue-600 text-white py-8">
                <div className="container mx-auto">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h3 className="text-lg font-bold mb-2">About AIESEC in Ruhuna</h3>
                            <p className="text-sm">AIESEC in Ruhuna is dedicated to empowering young people to make a positive impact on society. Our mission is to develop leadership skills through cross-cultural exchanges and professional experiences.</p>
                        </div>
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
                            <ul>
                                <li><a className="text-sm text-white hover:underline" href="#">Home</a></li>
                                <li><a className="text-sm text-white hover:underline" href="#">About</a></li>
                                <li><a className="text-sm text-white hover:underline" href="#">Events</a></li>
                                <li><a className="text-sm text-white hover:underline" href="#">Gallery</a></li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/3">
                            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
                            <ul className="flex space-x-4">
                                <li><a className="text-white hover:text-gray-300" href="#">Facebook</a></li>
                                <li><a className="text-white hover:text-gray-300" href="#">Instagram</a></li>
                                <li><a className="text-white hover:text-gray-300" href="#">Twitter</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
