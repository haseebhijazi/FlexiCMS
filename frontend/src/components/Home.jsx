import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white relative">
      <div className="w-full px-4 py-8 max-w-screen-lg mx-auto"> {/* Added max-w-screen-lg and mx-auto */}
        <header className="flex justify-between items-center mb-8"> 
          <Link to={isLoggedIn ? '/logout' : '/login'} className="absolute top-10 right-10">
            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md animate-neon hover:border-blue-700 hover:text-black hover:bg-blue-300 hover:border hover:border-solid hover:border-2">
                {isLoggedIn ? 'Log Out' : 'Log In'}
            </button>
          </Link>  
          <h1 className="text-3xl font-bold absolute top-10 left-10">Flexi CMS</h1> 
        </header>
        <div className="flex flex-col justify-between items-center mb-8">
            <h2 className="text-6xl font-bold mb-2 bg-gradient-to-r from-gray-700 to-gray-900 text-gray-200 bg-clip-text">Crafting Tables</h2>
            <h2 className="text-6xl font-bold mb-4 text-green-400">Simplified</h2>
            <br />
            <br />
            <br />
            <br />
            <div className="w-full md:w-3/4 mr-4 bg-gray-800 p-6 rounded-lg shadow-lg">
                <p className="text-xl font-sans leading-relaxed">
                    Unleash the power of seamless{" "}
                    <span className="text-green-400 font-semibold italic">SQL</span>{" "}
                    table creation with {" "}
                    <span className="text-blue-400 font-semibold italic">Flexi CMS</span>{" "},
                    your ultimate tool for crafting, managing, and optimizing database entities.
                    <br class="mb-2 md:mb-4" />
                    Designed for efficiency and ease,{" "}
                    <span className="text-blue-400 font-semibold italic">Flexi CMS</span>{" "}
                    empowers developers and database administrators to create robust {" "}
                    <span className="text-green-400 font-semibold italic">SQL</span>{" "} tables
                    effortlessly.
                </p>
        </div>

        <br />
        <br />
        <div className="w-full md:w-1/2 flex justify-center items-center space-x-8">
            <Link to="/signup">
                <button className="bg-green-600 text-gray-650 px-6 py-3 rounded-lg shadow-md font-semibold animate-neon-green hover:border-green-600 hover:text-black hover:bg-green-300 hover:border hover:border-solid hover:border-2">
                Get Started
                </button>
            </Link>
            <Link to="/dashboard">
                <button className="bg-blue-700 text-gray-650 px-6 py-3 rounded-lg shadow-md font-semibold animate-neon hover:border-blue-700 hover:text-black hover:bg-blue-300 hover:border hover:border-solid hover:border-2">
                Dashboard
                </button>
            </Link>
        </div>



    </div>
        {/* Additional UI elements can be added here */}
    </div>
    </div>
  );
}

export default Home;
