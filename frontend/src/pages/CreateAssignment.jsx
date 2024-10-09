// src/pages/CreateAssignment.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreateAssignment = () => {
  const [modeCode, setModeCode] = useState('');
  const [assignName, setAssignName] = useState('');
  const [uploadedDate, setUploadedDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      modeCode,
      assignName,
      uploadedDate,
      dueDate,
      description,
    });
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
      <div className="page-Container">
        <form onSubmit={handleSubmit} className="creatAssignForm">
          <div className="inputContainer"> {/* Increased bottom margin for spacing */}
            <label className="form-label" htmlFor="modeCode">
              Mode Code
            </label>
            <input
              type="text"
              id="modeCode"
              placeholder="Enter mode code"
              value={modeCode}
              onChange={(e) => setModeCode(e.target.value)}
              className="assign-Input"
              required
            />
          </div>
          <div className="inputContainer"> {/* Increased bottom margin for spacing */}
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
          <div className="inputContainer"> {/* Increased bottom margin for spacing */}
            <label className="form-label" htmlFor="uploadedDate">
              Uploaded Date
            </label>
            <input
              type="date"
              id="uploadedDate"
              value={uploadedDate}
              onChange={(e) => setUploadedDate(e.target.value)}
              className="assign-Input"
              required
            />
          </div>
          <div className="inputContainer"> {/* Increased bottom margin for spacing */}
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
          <div className="inputContainer"> {/* Increased bottom margin for spacing */}
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
