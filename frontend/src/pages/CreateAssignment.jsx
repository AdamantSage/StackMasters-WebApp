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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 p-4">
      <h1 className="text-4xl font-bold mb-4">Create Assignment</h1>
      <div className="links-container mt-4">
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">Landing Page</Link>
        <Link to="/list-videos" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">List Videos</Link>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col bg-white p-6 rounded shadow-md w-96">
        <div className="mb-20"> {/* Increased bottom margin for spacing */}
          <label className="block text-gray-700 font-bold mb-2" htmlFor="modeCode">
            Mode Code
          </label>
          <input
            type="text"
            id="modeCode"
            placeholder="Enter mode code"
            value={modeCode}
            onChange={(e) => setModeCode(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <div className="mb-20"> {/* Increased bottom margin for spacing */}
          <label className="block text-gray-700 font-bold mb-2" htmlFor="assignName">
            Assignment Name
          </label>
          <input
            type="text"
            id="assignName"
            placeholder="Enter assignment name"
            value={assignName}
            onChange={(e) => setAssignName(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <div className="mb-20"> {/* Increased bottom margin for spacing */}
          <label className="block text-gray-700 font-bold mb-2" htmlFor="uploadedDate">
            Uploaded Date
          </label>
          <input
            type="date"
            id="uploadedDate"
            value={uploadedDate}
            onChange={(e) => setUploadedDate(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <div className="mb-20"> {/* Increased bottom margin for spacing */}
          <label className="block text-gray-700 font-bold mb-2" htmlFor="dueDate">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <div className="mb-20"> {/* Increased bottom margin for spacing */}
          <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full h-24"
            required
          />
        </div>
        <div className="mb-20">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
            Create Assignment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;
