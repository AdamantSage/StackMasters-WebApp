import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import the image from the src folder
import logo from '../CMYK_NWU_Logo-Purple.png'; // Adjusted path to import the image

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <header>
        <div className="container">
          <a href="#" className="logo">Stack <b>Masters</b></a>
          <ul className="links">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/watch-feedback/:id">Watch Video</Link>
            </li>
            <li>
              <Link to="/list-videos">List Video</Link>
            </li>
            <li>
              <Link to="/list-assignments">List Assignments</Link>
            </li>
            <li>
              <Link to="/user-admin">User Admin</Link>
            </li>
            <li>
              <Link to="/user-lecturer">Lecturer</Link>
            </li>
            <li>
              <Link to="/create-assignment">Create Assignments</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/info">Info</Link>
            </li>
          </ul>
        </div>
      </header>
      <div className="content">
        <div className="container">
          <div className="info">
            <h1>Welcome</h1>
                <p className="motto"> It All Starts Here.</p>
            <button onClick={handleGetStarted} className="get-started-button">Get Started</button>
          </div>
          <div className="image">
            <img src={logo} alt="Overview" className="landing-image" /> {/* Use the imported logo */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
