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
    const socket = io('http://localhost:8000'); // Connect to our Socket.IO server
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        // Format dates to SQL datetime format
        const formattedUploadDate = new Date(uploadDate).toISOString().slice(0, 19).replace('T', ' ');
        const formattedDueDate = new Date(dueDate).toISOString().slice(0, 19).replace('T', ' ');

        const assignmentData = {
            module_code: moduleCode,
            assign_name: assignName,
            upload_date: formattedUploadDate, // Use formatted date
            due_date: formattedDueDate,       // Use formatted date
            assign_desc: assignDesc,
            user_id: userId || 1, // Include user_id
        };

        try {

             // Emit the 'createAssignment' event to the server
             socket.emit('createAssignment', assignmentData);
             
            const response = await axios.post('http://localhost:5000/assignment', assignmentData);
            console.log('Assignment created successfully:', response.data);
            if (response.status === 201) { // Check for successful creation
                setNotification('Assignment created successfully!');
            } else {
                setNotification('Unexpected response. Please try again.');
            }

            // Optionally clear the form after successful submission
            setModuleCode('');
            setAssignName('');
            setUploadDate('');
            setDueDate('');
            setAssignDesc('');
        } catch (error) {
            console.error('Error creating assignment:', error);
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
                       
                    </ul>
                </div>
            </header>
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
                    {notification && (
                      <div className="notification">
                          {notification}
                          <button onClick={handleCloseNotification} className="close-button"></button>
                      </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateAssignment;
