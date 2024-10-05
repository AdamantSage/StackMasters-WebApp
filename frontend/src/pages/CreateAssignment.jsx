// src/pages/CreateAssignment.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CreateAssignment = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-4xl font-bold mb-4">Create Assignment</h1>
      <div className="links-container">
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Landing Page</Link>
        <Link to="/list-videos" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">List Videos</Link>
      </div>
    </div>
  );
};

export default CreateAssignment;
