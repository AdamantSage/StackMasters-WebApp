import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const ListAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showMore, setShowMore] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  // Sample module codes for dropdown
  const moduleCodes = ['CS101', 'CS102', 'CS103']; // Replace with actual module codes

  // Fetch assignments from API
  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/assignment');
      console.log('API Response:', response.data); // Log API response
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []); // Fetch assignments on component mount

  // Handle toggling show more / show less
  const toggleShowMore = () => {
    setShowMore(!showMore);
    setVisibleCount(showMore ? 3 : assignments.length); // Show all if 'showMore' is true, else show first 3
  };

  // Filter assignments based on module filter
  const filteredAssignments = assignments.filter(assignment =>
    (selectedModule ? assignment.module_code === selectedModule : true) && // Filter by selected module
    (moduleFilter ? assignment.module_code.toLowerCase().includes(moduleFilter.toLowerCase()) : true)
  );

  return (
    <div className="page">
      <header>
        <div className="container">
          <h1 className="page-heading">List of Assignments</h1>
          <ul className="linksList">
            <li>
              <Link to="/" className="link">Landing Page</Link>
            </li>
            <li>
              <Link to="/user-admin" className="link">User Administration</Link>
            </li>
            <li>
              <Link to="/create-assignment" className="link">Create Assignment</Link>
            </li>
          </ul>
        </div>
      </header>
      <div className="page-Container">
        {/* Dropdown for module selection */}
        <div className="module-container">
          <label htmlFor="module">Select Module:</label>
          <select
            id="module"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="">All Modules</option>
            {moduleCodes.map((module, index) => (
              <option key={index} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>
        {/* List of Assignments */}
        <TableContainer component={Paper} className="fixed-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Submitted By</strong></TableCell>
                <TableCell><strong>Time Submitted</strong></TableCell>
                <TableCell><strong>Module</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssignments.slice(0, visibleCount).map(assignment => (
                <TableRow key={assignment.assignment_id}>
                  <TableCell>{assignment.assign_name}</TableCell> {/* Update to assign_name */}
                  <TableCell>{assignment.user_id}</TableCell> {/* This might need adjustment based on how you want to display the user's name */}
                  <TableCell>{new Date(assignment.upload_date).toLocaleString()}</TableCell> {/* Format date as needed */}
                  <TableCell>{assignment.module_code}</TableCell> {/* Update to module_code */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Button to toggle show more/less */}
        <button
          className="get-started-button"
          onClick={toggleShowMore}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
};

export default ListAssignments;
