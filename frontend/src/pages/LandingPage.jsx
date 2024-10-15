// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

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
            <p>Just an overview maybe</p>
            <button onClick={handleGetStarted} className="get-started-button">Get Started</button>
          </div>
          <div className="image">
            /* Add image here */
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
