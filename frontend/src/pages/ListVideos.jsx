// src/pages/ListVideos.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ListVideos = () => {
  // Hardcoded video submissions with user name
  const videos = [
    { id: 1, title: 'Video 1', userName: 'Alice Johnson', timeSubmitted: '2024-10-08 01:00 PM' },
    { id: 2, title: 'Video 2', userName: 'Bob Smith', timeSubmitted: '2024-10-07 11:30 AM' },
    { id: 3, title: 'Video 3', userName: 'Charlie Brown', timeSubmitted: '2024-10-06 03:15 PM' },
    { id: 4, title: 'Video 4', userName: 'David Wilson', timeSubmitted: '2024-10-05 09:45 AM' },
    { id: 5, title: 'Video 5', userName: 'Eva Green', timeSubmitted: '2024-10-04 02:20 PM' },
    { id: 6, title: 'Video 6', userName: 'Frankie Blue', timeSubmitted: '2024-10-03 04:50 PM' },
    { id: 7, title: 'Video 7', userName: 'Gina Purple', timeSubmitted: '2024-10-02 12:10 PM' }
  ];

  const [visibleCount, setVisibleCount] = useState(3); // Number of visible videos
  const [showMore, setShowMore] = useState(false); // Toggle for showing more/less

  // Handle toggling show more / show less
  const toggleShowMore = () => {
    setShowMore(!showMore);
    setVisibleCount(showMore ? 3 : videos.length); // Show all if 'showMore' is true, else show first 3
  };

  return (
    <div className="page">
      <header>
        <div className="container">
          <h1 className="page-heading">List of Video Submissions</h1>
          <ul className="linksList">
            <li>
              <Link to="/" className="link">Landing Page</Link>
            </li>
            <li>
            <Link to="/watch-feedback/:id" className="link">Watch Feedback</Link>
            </li>
          </ul>
        </div>
      </header>
      <div className="page-Container"> 
        {/* List of Videos */}
        <div className="displayBox">
          <ul className="list">
            {videos.slice(0, visibleCount).map(video => (
              <li key={video.id} className="record">
                <strong>{video.title}</strong> - Submitted by {video.userName} on {video.timeSubmitted}
              </li>
            ))}
          </ul>
        </div>
        {/* Button to toggle show more/less */}
        <button
          className="get-started-button"
          onClick={toggleShowMore}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
    
  );
};

export default ListVideos;
