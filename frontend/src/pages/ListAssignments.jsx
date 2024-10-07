import React from 'react';
import { Link } from 'react-router-dom';

const ListAssignments = () => {
  // Hardcoded assignments with user name and time submitted
  const assignments = [
    { id: 1, title: 'Assignment 1', userName: 'John Doe', timeSubmitted: '2024-10-07 12:30 PM' },
    { id: 2, title: 'Assignment 2', userName: 'Jane Smith', timeSubmitted: '2024-10-06 11:00 AM' },
    { id: 3, title: 'Assignment 3', userName: 'Mark Johnson', timeSubmitted: '2024-10-05 03:45 PM' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-4xl font-bold mb-4">List of Assignments</h1>

      {/* Listbox with additional information (userName and timeSubmitted) */}
      <select className="w-1/2 p-2 border rounded mb-4">
        {assignments.map(assignment => (
          <option key={assignment.id} value={assignment.id}>
            {assignment.title} - Submitted by {assignment.userName} at {assignment.timeSubmitted}
          </option>
        ))}
      </select>

      <div className="links-container">
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Landing
        </Link>
        <Link to="/user-admin" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700">
          User Administration Page
        </Link>
        <Link to="/create-assignment" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Create Assignment
        </Link>
      </div>
    </div>
  );
};

export default ListAssignments;


