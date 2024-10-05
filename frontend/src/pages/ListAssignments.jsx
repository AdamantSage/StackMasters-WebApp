// src/pages/ListAssignments.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ListAssignments = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-4xl font-bold mb-4">List Assignments</h1>
      <div className="links-container">
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Landing Page</Link>
        <Link to="/user-admin" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700">User Administration Page</Link>
        <Link to="/create-assignment" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700">Create Assignment</Link>
      </div>
    </div>
  );
};

export default ListAssignments;
