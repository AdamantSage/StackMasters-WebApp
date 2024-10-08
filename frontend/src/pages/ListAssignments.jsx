// src/components/ListAssignments.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ListAssignments = () => {
  // Hardcoded assignments with user name and time submitted
  const assignments = [
    { id: 1, title: 'Assignment 1', userName: 'John Doe', timeSubmitted: '2024-10-07 12:30 PM' },
    { id: 2, title: 'Assignment 2', userName: 'Jane Smith', timeSubmitted: '2024-10-06 11:00 AM' },
    { id: 3, title: 'Assignment 3', userName: 'Mark Johnson', timeSubmitted: '2024-10-05 03:45 PM' },
    { id: 4, title: 'Assignment 4', userName: 'Emily Davis', timeSubmitted: '2024-10-04 10:20 AM' },
    { id: 5, title: 'Assignment 5', userName: 'Michael Brown', timeSubmitted: '2024-10-03 09:15 AM' },
    { id: 6, title: 'Assignment 6', userName: 'Sarah Wilson', timeSubmitted: '2024-10-02 04:50 PM' },
    { id: 7, title: 'Assignment 7', userName: 'David Martinez', timeSubmitted: '2024-10-01 02:10 PM' }
  ];

  const [visibleCount, setVisibleCount] = useState(3); // Number of visible assignments
  const [showMore, setShowMore] = useState(false); // Toggle for showing more/less

  // Handle toggling show more / show less
  const toggleShowMore = () => {
    setShowMore(!showMore);
    setVisibleCount(showMore ? 3 : assignments.length); // Show all if 'showMore' is true, else show first 3
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      {/* Container to center content */}
      <div className="container mx-auto flex flex-col items-center p-6 bg-white shadow-md rounded-lg">
        <header className="flex justify-between items-center w-full mb-6">
          <h1 className="text-4xl font-bold">List of Assignments</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-purple-700 hover:underline">Landing Page</Link>
              </li>
              <li>
              <Link to="/watch-feedback/:id" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Watch Feedback</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* List of Assignments */}
        <ul className="list-disc w-1/2 p-4 border rounded mb-6">
          {assignments.slice(0, visibleCount).map(assignment => (
            <li key={assignment.id} className="mb-2">
              <strong>{assignment.title}</strong> - Submitted by {assignment.userName} on {assignment.timeSubmitted}
            </li>
          ))}
        </ul>

        {/* Button to toggle show more/less */}
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 mb-6"
          onClick={toggleShowMore}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
};

export default ListAssignments;
