// src/pages/ListVideos.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ListVideos = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-4xl font-bold mb-4">List Videos</h1>
      <div className="links-container">
        <Link to="/watch-feedback/:id" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Watch Feedback</Link>
      </div>
    </div>
  );
};

export default ListVideos;
