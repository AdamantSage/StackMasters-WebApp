import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const ListVideos = () => {
  const [videos, setVideos] = useState([]);
  const [distinctAssignments, setDistinctAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState('');

  // Fetch videos from the API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('https://hmsstackmasters-hvfcb8drb4d0egf8.southafricanorth-01.azurewebsites.net/video-submissions');
        setVideos(response.data);

        // Extract distinct assignment names after fetching videos
        const uniqueAssignments = [...new Set(response.data.map(video => video.assign_name))];
        setDistinctAssignments(uniqueAssignments);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again later.');
      }
    };

    fetchVideos();
  }, []);

  // Reset visible count when the selected assignment changes
  useEffect(() => {
    setVisibleCount(3); // Reset to show 3 when assignment is changed
    setShowMore(false); // Reset the 'Show More' state
  }, [selectedAssignment]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
    setVisibleCount(showMore ? 3 : filteredVideos.length); // Show all or reset to 3
  };

  // Filter videos by selected assignment name
  const filteredVideos = videos.filter(video => 
    selectedAssignment === '' || video.assign_name?.toLowerCase().trim() === selectedAssignment.toLowerCase().trim()
  );

  return (
    <div className="page">
      <header>
        <div className="container">
          <h1 className="page-heading">List of Video Submissions</h1>
          <ul className="linksList">
            <li>
              <Link to="/" className="link">Landing Page</Link>
            </li>
          </ul>
        </div>
      </header>

      <div className="page-Container">
        <div className="assignment-container">
          <label htmlFor="assignment">Filter by Assignment Name:</label>
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            aria-label="Select Assignment"
            style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
          >
            <option value="">Select an assignment...</option>
            {distinctAssignments.length > 0 ? (
              distinctAssignments.map((assignment, index) => (
                <option key={index} value={assignment}>
                  {assignment}
                </option>
              ))
            ) : (
              <option disabled>No assignments available</option>
            )}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <TableContainer component={Paper} className="fixed-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Submission ID</strong></TableCell>
                <TableCell><strong>Assignment Name</strong></TableCell>
                <TableCell><strong>Submitted By (User ID)</strong></TableCell>
                <TableCell><strong>Time Submitted</strong></TableCell>
                <TableCell><strong>Assignment ID</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVideos.length > 0 ? (
                filteredVideos.slice(0, visibleCount).map((video) => (
                  <TableRow key={video.sub_id}>
                    <TableCell>{video.sub_id}</TableCell>
                    <TableCell>{video.assign_name}</TableCell>
                    <TableCell>{video.user_id}</TableCell>
                    <TableCell>{new Date(video.upload_date).toLocaleString()}</TableCell>
                    <TableCell>{video.assignment_id}</TableCell>
                    <TableCell>
                      <Link 
                        to={`/watch-feedback/${encodeURIComponent(video.videoUrl)}`}
                        onClick={() => console.log(video.videoUrl)}
                      >
                        Watch Video
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                    No videos found for this assignment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredVideos.length > visibleCount && (
          <button className="get-started-button" onClick={toggleShowMore}>
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListVideos;
