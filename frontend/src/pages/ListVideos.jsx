// src/pages/ListVideos.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ListVideos = () => {
  // Hardcoded video submissions with user name and assignment ID
  const videos = [
    { id: 1, title: 'Video 1', userName: 'Alice Johnson', timeSubmitted: '2024-10-08 01:00 PM', assignmentId: 1 },
    { id: 2, title: 'Video 2', userName: 'Bob Smith', timeSubmitted: '2024-10-07 11:30 AM', assignmentId: 1 },
    { id: 3, title: 'Video 3', userName: 'Charlie Brown', timeSubmitted: '2024-10-06 03:15 PM', assignmentId: 2 },
    { id: 4, title: 'Video 4', userName: 'David Wilson', timeSubmitted: '2024-10-05 09:45 AM', assignmentId: 2 },
    { id: 5, title: 'Video 5', userName: 'Eva Green', timeSubmitted: '2024-10-04 02:20 PM', assignmentId: 3 },
    { id: 6, title: 'Video 6', userName: 'Frankie Blue', timeSubmitted: '2024-10-03 04:50 PM', assignmentId: 3 },
    { id: 7, title: 'Video 7', userName: 'Gina Purple', timeSubmitted: '2024-10-02 12:10 PM', assignmentId: 4 }
  ];

  // Hardcoded assignments
  const assignments = [
    { id: 1, title: 'Assignment 1' },
    { id: 2, title: 'Assignment 2' },
    { id: 3, title: 'Assignment 3' },
    { id: 4, title: 'Assignment 4' }
  ];

  const [selectedAssignment, setSelectedAssignment] = useState(''); // Selected assignment for filtering
  const [visibleCount, setVisibleCount] = useState(3); // Number of visible videos
  const [showMore, setShowMore] = useState(false); // Toggle for showing more/less

  // Handle toggling show more / show less
  const toggleShowMore = () => {
    setShowMore(!showMore);
    setVisibleCount(showMore ? 3 : videos.length); // Show all if 'showMore' is true, else show first 3
  };

  // Filter videos based on selected assignment
  const filteredVideos = videos.filter(video =>
    selectedAssignment ? video.assignmentId === parseInt(selectedAssignment) : true
  );

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
        {/* Dropdown for assignment selection */}
        <div className="assignment-container">
          <label htmlFor="assignment">Select Assignment:</label>
          <select
            id="assignment"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            <option value="">All Assignments</option>
            {assignments.map(assignment => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>

        {/* List of Videos */}
        <div className="displayBox">
          <ul className="list">
            {filteredVideos.slice(0, visibleCount).map(video => (
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
