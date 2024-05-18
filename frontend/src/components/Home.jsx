import React, { useState, useEffect } from 'react'
import Button from './Button';

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

  return (
    <div>
        <h1>
            Flexi CMS
        </h1>
        <div>
            <p>
                Unleash the power of seamless SQL table creation with Flexi CMS, your ultimate tool for crafting, managing, and optimizing database entities.
                <br/>
                Designed for efficiency and ease, Flexi CMS empowers developers and database administrators to create robust SQL tables effortlessly.
            </p>
        </div>

        <Button text= {isLoggedIn ? 'Log Out' : 'Log In'} goto={'/logout'}/>
        <br/>
        <Button text={'Dashboard'} goto={'/dashboard'} />
        <Button text={'Get Started'} goto={'/signup'} />
        
    </div>
  )
}

export default Home