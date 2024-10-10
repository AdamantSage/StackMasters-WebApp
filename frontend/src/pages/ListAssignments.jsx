// src/components/ListAssignments.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ListAssignments = () => {
  // Hardcoded assignments with user name, time submitted, and module code
  const assignments = [
    { id: 1, title: 'Assignment 1', userName: 'John Doe', timeSubmitted: '2024-10-07 12:30 PM', module: 'MOD123' },
    { id: 2, title: 'Assignment 2', userName: 'Jane Smith', timeSubmitted: '2024-10-06 11:00 AM', module: 'MOD456' },
    { id: 3, title: 'Assignment 3', userName: 'Mark Johnson', timeSubmitted: '2024-10-05 03:45 PM', module: 'MOD789' },
    { id: 4, title: 'Assignment 4', userName: 'Emily Davis', timeSubmitted: '2024-10-04 10:20 AM', module: 'MOD123' },
    { id: 5, title: 'Assignment 5', userName: 'Michael Brown', timeSubmitted: '2024-10-03 09:15 AM', module: 'MOD456' },
    { id: 6, title: 'Assignment 6', userName: 'Sarah Wilson', timeSubmitted: '2024-10-02 04:50 PM', module: 'MOD789' },
    { id: 7, title: 'Assignment 7', userName: 'David Martinez', timeSubmitted: '2024-10-01 02:10 PM', module: 'MOD123' }
  ];

  const moduleCodes = ['MOD123', 'MOD456', 'MOD789'];

  const [visibleCount, setVisibleCount] = useState(3); // Number of visible assignments
  const [showMore, setShowMore] = useState(false); // Toggle for showing more/less
  const [selectedModule, setSelectedModule] = useState(''); // Module filter

  // Handle toggling show more / show less
  const toggleShowMore = () => {
    setShowMore(!showMore);
    setVisibleCount(showMore ? 3 : assignments.length); // Show all if 'showMore' is true, else show first 3
  };

  // Filter assignments based on selected module
  const filteredAssignments = assignments.filter(assignment =>
    selectedModule ? assignment.module === selectedModule : true
  );

  return (
    <div className="page">
      <header>
        <div className="container">
          <h1 className="page-heading">List of Assignments</h1>
          <ul className="linksList">
            <li>
              <Link to="/" className="link">Landing Page</Link>
            </li>
            <li>
              <Link to="/user-admin" className="link">User Administration</Link>
            </li>
            <li>
              <Link to="/create-assignment" className="link">Create Assignment</Link>
            </li>
          </ul>
        </div>
      </header>
      <div className="page-Container">
        {/* Dropdown for module selection */}
        <div className="module-container">
          <label htmlFor="module">Select Module:</label>
          <select
            id="module"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="">All Modules</option>
            {moduleCodes.map((module, index) => (
              <option key={index} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>

        {/* List of Assignments */}
        <div className="displayBox">
          <ul className="list">
            {filteredAssignments.slice(0, visibleCount).map(assignment => (
              <li key={assignment.id} className="record">
                <strong>{assignment.title}</strong> - Submitted by {assignment.userName} on {assignment.timeSubmitted} (Module: {assignment.module})
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

export default ListAssignments;
