import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const VideoFeedback = () => {
  const { id } = useParams(); // id contains the video URL
  console.log('Received video URL:', id); // Log the video URL

  // State variables for feedback
  const [assignment_id, setAssignmentId] = useState(''); // Updated variable name
  const [user_id, setUserId] = useState(''); // Updated variable name
  const [sub_id, setSubId] = useState(''); // Updated variable name
  const [grade, setGrade] = useState('');
  const [description, setFeedbackDescription] = useState(''); // Updated variable name

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/submission/feedback', {
        assignment_id, // Updated key name
        user_id, // Updated key name
        sub_id, // Updated key name
        grade,
        description, // Updated key name
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
            {/* Other links can go here */}
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
            <label htmlFor="assignment_id">Assignment ID:</label> {/* Updated id */}
            <input
              type="text"
              id="assignment_id" // Updated id
              value={assignment_id} // Updated state variable
              onChange={(e) => setAssignmentId(e.target.value)}
              required
              placeholder="Enter assignment ID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="user_id">User ID:</label> {/* Updated id */}
            <input
              type="text"
              id="user_id" // Updated id
              value={user_id} // Updated state variable
              onChange={(e) => setUserId(e.target.value)}
              required
              placeholder="Enter user ID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="sub_id">Submission ID:</label> {/* Updated id */}
            <input
              type="text"
              id="sub_id" // Updated id
              value={sub_id} // Updated state variable
              onChange={(e) => setSubId(e.target.value)}
              required
              placeholder="Enter submission ID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="grade">Grade:</label>
            <input
              type="number"
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              min="0"
              max="100"
              placeholder="Enter grade out of 100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Feedback Description:</label> {/* Updated label */}
            <textarea
              id="description" // Updated id
              value={description} // Updated state variable
              onChange={(e) => setFeedbackDescription(e.target.value)}
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
