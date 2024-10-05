// src/pages/VideoFeedback.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const VideoFeedback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-4xl font-bold mb-4">Video Feedback</h1>
      <div className="links-container">
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Landing Page</Link>
      </div>
    </div>
  );
};

export default VideoFeedback;
