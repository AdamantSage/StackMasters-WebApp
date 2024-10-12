import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const VideoFeedback = () => {
  const [mark, setMark] = useState(''); // State for mark input
  const [comment, setComment] = useState(''); // State for feedback comment

  // Use location to access the passed video URL
  const location = useLocation();
  const videoUrl = location.state?.video?.videoUrl; // Get the video URL from the location state

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // Handle feedback submission logic here
    console.log('Feedback submitted:', { mark, comment });
    // You can send this data to your backend using fetch or axios.
  };

  return (
    <div className="page"> 
      <header>
        <div className="container">
          <h1 className="page-heading">Watch Video and Provide Feedback</h1>
          <ul className="linksList">
            <li><Link to="/" className="link">Landing Page</Link></li>
            <li><Link to="/list-videos" className="link">Back to Video List</Link></li>
          </ul>
        </div>
      </header>

      <div className="page-Container">
        {/* Video Player */}
        {videoUrl ? (
          <video width="640" height="360" controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>No video available to play.</p>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleSubmitFeedback} className="feedback-form">
          <div className="form-group">
            <label htmlFor="mark">Mark:</label>
            <input
              type="text"
              id="mark"
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              required
              min="0"
              max="100"
              placeholder="Enter mark out of 100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Commentary Feedback:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Enter your feedback here"
            ></textarea>
          </div>
          <button type="submit" className="feedback-Sub">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default VideoFeedback;
