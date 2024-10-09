// src/pages/VideoFeedback.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const VideoFeedback = () => {
  return (
    <div className="page"> 
      <header>
        <div className="container">
          <h1 className="page-heading">User Administration Page</h1>
          <ul className="linksList">
          <Link to="/" className="link">Landing Page</Link>
          </ul>
        </div>
      </header>
      <div className="page-Container">
        <h3>Video here</h3>
      </div>
    </div>
  );
};

export default VideoFeedback;
