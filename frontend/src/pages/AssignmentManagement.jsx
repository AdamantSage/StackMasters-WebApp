import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showMore, setShowMore] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const [moduleFilter] = useState('');
  const [distinctModuleCodes, setDistinctModuleCodes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [editAssignment, setEditAssignment] = useState({
    assign_name: '',
    module_code: '',
    // other fields as necessary
  });

  // Fetch assignments from API and extract distinct module codes
  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/assignment');
      console.log('API Response:', response.data);
      setAssignments(response.data);

      // Extract distinct module codes
      const uniqueModules = [...new Set(response.data.map(assignment => assignment.module_code))];
      setDistinctModuleCodes(uniqueModules);
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
    setVisibleCount(showMore ? 3 : assignments.length);
  };

  // Filter assignments based on selected module and module filter
  const filteredAssignments = assignments.filter(assignment =>
    (selectedModule ? assignment.module_code === selectedModule : true) &&
    (moduleFilter ? assignment.module_code.toLowerCase().includes(moduleFilter.toLowerCase()) : true)
  );

  // Handle open dialog for editing an assignment
  const handleOpenDialog = (assignment) => {
    setCurrentAssignment(assignment);
    setEditAssignment({ assign_name: assignment.assign_name, module_code: assignment.module_code });
    setOpenDialog(true);
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle update assignment
  const handleUpdateAssignment = async () => {
    try {
      await axios.put(`https://hmsstackmasters-hvfcb8drb4d0egf8.southafricanorth-01.azurewebsites.net//assignment/${currentAssignment.assignment_id}`, editAssignment);
      fetchAssignments(); // Refresh the assignment list
      handleCloseDialog(); // Close dialog
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  // Handle delete assignment
  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await axios.delete(`https://hmsstackmasters-hvfcb8drb4d0egf8.southafricanorth-01.azurewebsites.net//assignment/${assignmentId}`);
      fetchAssignments(); // Refresh the assignment list
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  return (
    <div className="page">
      <header>
        <div className="container">
          <h1 className="page-heading">Assignment Management</h1>
          
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
            {distinctModuleCodes.map((module, index) => (
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
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssignments.slice(0, visibleCount).map(assignment => (
                <TableRow key={assignment.assignment_id}>
                  <TableCell>{assignment.assign_name}</TableCell>
                  <TableCell>{assignment.user_id}</TableCell>
                  <TableCell>{new Date(assignment.upload_date).toLocaleString()}</TableCell>
                  <TableCell>{assignment.module_code}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenDialog(assignment)}>Edit</Button>
                    <Button color="error" onClick={() => handleDeleteAssignment(assignment.assignment_id)}>Delete</Button>
                  </TableCell>
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

        {/* Dialog for editing assignment */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit this assignment, please modify the fields below.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={editAssignment.assign_name}
              onChange={(e) => setEditAssignment({ ...editAssignment, assign_name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Module Code"
              type="text"
              fullWidth
              variant="outlined"
              value={editAssignment.module_code}
              onChange={(e) => setEditAssignment({ ...editAssignment, module_code: e.target.value })}
            />
            {/* Add more fields as necessary */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleUpdateAssignment}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default AssignmentManagement;
