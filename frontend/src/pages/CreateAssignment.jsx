import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CreateAssignment = ({ userId }) => { // Accept userId as a prop
  const [moduleCode, setModuleCode] = useState('');
  const [assignName, setAssignName] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [notification, setNotification] = useState(''); // Notification state

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    const assignmentData = {
      module_code: moduleCode,
      assign_name: assignName,
      upload_date: uploadDate,
      due_date: dueDate,
      assign_desc: assignDesc,
      user_id: userId || 1, // Include user_id
    };

    try {
      try {
        const response = await axios.post('http://localhost:5000/assignment', assignmentData);
        console.log('Assignment created successfully:', response.data);
        if (response.status === 201) { // Check for successful creation
          setNotification('Assignment created successfully!');
        } else {
          setNotification('Unexpected response. Please try again.');
        }
      } catch (error) {
        console.error('Error creating assignment:', error);
        setNotification('Error creating assignment. Please try again.');
      }
      
      // Optionally clear the form after successful submission
      setModuleCode('');
      setAssignName('');
      setUploadDate('');
      setDueDate('');
      setAssignDesc('');
    } catch (error) {
      console.error('Error creating assignment:', error);
      // Show error notification
      setNotification('Error creating assignment. Please try again.');
    }
  };

  const handleCloseNotification = () => {
    setNotification(''); // Clear notification
  };

  return (
    <div className="page">
      <header>
        <div className="container">
          <h1 className="page-heading">Create Assignment</h1>
          <ul className="linksList">
            <li>
              <Link to="/" className="link">Landing Page</Link>
            </li>
            <li>
              <Link to="/list-videos" className="link">List Videos</Link>
            </li>
          </ul>
        </div>
      </header>
      {notification && (
        <div className="notification">
          {notification}
          <button onClick={handleCloseNotification} className="close-button">X</button>
        </div>
      )}
      <div className="page-Container">
        <form onSubmit={handleSubmit} className="creatAssignForm">
          <div className="inputContainer">
            <label className="form-label" htmlFor="moduleCode">
              Module Code
            </label>
            <input
              type="text"
              id="moduleCode"
              placeholder="Enter module code"
              value={moduleCode}
              onChange={(e) => setModuleCode(e.target.value)}
              className="assign-Input"
              required
            />
          </div>
          <div className="inputContainer">
            <label className="form-label" htmlFor="assignName">
              Assignment Name
            </label>
            <input
              type="text"
              id="assignName"
              placeholder="Enter assignment name"
              value={assignName}
              onChange={(e) => setAssignName(e.target.value)}
              className="assign-Input"
              required
            />
          </div>
          <div className="inputContainer">
            <label className="form-label" htmlFor="uploadDate">
              Upload Date
            </label>
            <input
              type="date"
              id="uploadDate"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
              className="assign-Input"
              required
            />
          </div>
          <div className="inputContainer">
            <label className="form-label" htmlFor="dueDate">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="assign-Input"
              required
            />
          </div>
          <div className="inputContainer">
            <label className="form-label" htmlFor="assignDesc">
              Description
            </label>
            <textarea
              id="assignDesc"
              placeholder="Enter description"
              value={assignDesc}
              onChange={(e) => setAssignDesc(e.target.value)}
              className="assign-Input"
              required
            />
          </div>
          <button type="submit" className="get-started-button">
            Create Assignment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
