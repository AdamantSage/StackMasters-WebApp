import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const VideoFeedback = () => {
  const { id } = useParams(); // id contains the video URL
  console.log('Received video URL:', id); // Log the video URL

  const [mark, setMark] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/marks/submit-feedback', {
        videoUrl: id, // Use id here as videoUrl
        mark,
        comment,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
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
        {id ? (
          <video width="640" height="360" controls autoPlay>
            <source src={decodeURIComponent(id)} type="video/mp4" />
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
              type="number"
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
