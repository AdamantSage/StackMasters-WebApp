// src/components/AssignmentManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignmentManagement = () => {
    const [assignments, setAssignments] = useState([]);
    const [formData, setFormData] = useState({
        assignment_id: "",
        module_code: "",
        assign_name: "",
        upload_date: "",
        due_date: "",
        assign_desc: "",
    });
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await axios.get("http://localhost:5000/assignment");
            setAssignments(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch assignments.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateAssignment();
        setFormData({
            assignment_id: "",
            module_code: "",
            assign_name: "",
            upload_date: "",
            due_date: "",
            assign_desc: "",
        });
        setEditing(false);
    };

    const updateAssignment = async () => {
        try {
            await axios.put(`http://localhost:5000/assignment/${formData.assignment_id}`, formData);
            fetchAssignments(); // Refresh the list after updating
        } catch (err) {
            console.error(err);
            setError("Failed to update assignment.");
        }
    };

    const handleEdit = (assignment) => {
        setFormData(assignment);
        setEditing(true);
    };

    const handleDelete = async (assignment_id) => {
        try {
            await axios.delete(`http://localhost:5000/assignment/${assignment_id}`);
            fetchAssignments(); // Refresh the list after deleting
        } catch (err) {
            console.error(err);
            setError("Failed to delete assignment.");
        }
    };

    return (
        <div className="page">
            <header>
                <div className="container">
                    <h1 className="page-heading">Manage Assignments</h1>
                    {error && <p>{error}</p>}
                </div>
            </header>
            <div className="page-Container">
                {editing && (
                    <form onSubmit={handleSubmit} className="manageAssignForm">
                        <input
                            type="hidden"
                            name="assignment_id"
                            value={formData.assignment_id}
                        />
                        <div className="inputContainer">
                            <label className="form-label" htmlFor="moduleCode">
                                Module Code
                            </label>
                            <input
                                type="text"
                                name="module_code"
                                id="moduleCode"
                                placeholder="Module Code"
                                value={formData.module_code}
                                onChange={handleInputChange}
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
                                name="assign_name"
                                id="assignName"
                                placeholder="Assignment Name"
                                value={formData.assign_name}
                                onChange={handleInputChange}
                                className="assign-Input"
                                required
                            />
                        </div>
                        <div className="inputContainer">
                            <label className="form-label" htmlFor="uploadDate">
                                Upload Date
                            </label>
                            <input
                                type="datetime-local"
                                name="upload_date"
                                id="uploadDate"
                                value={formData.upload_date}
                                onChange={handleInputChange}
                                className="assign-Input"
                                required
                            />
                        </div>
                        <div className="inputContainer">
                            <label className="form-label" htmlFor="dueDate">
                                Due Date
                            </label>
                            <input
                                type="datetime-local"
                                name="due_date"
                                id="dueDate"
                                value={formData.due_date}
                                onChange={handleInputChange}
                                className="assign-Input"
                                required
                            />
                        </div>
                        <div className="inputContainer">
                            <label className="form-label" htmlFor="assignDesc">
                                Description
                            </label>
                            <textarea
                                name="assign_desc"
                                id="assignDesc"
                                placeholder="Description"
                                value={formData.assign_desc}
                                onChange={handleInputChange}
                                className="assign-Input"
                                required
                            />
                        </div>
                        <button type="submit" className="get-started-button">
                            Update Assignment
                        </button>
                    </form>
                )}
    
                <h2>Existing Assignments</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Assignment ID</th>
                            <th>Module Code</th>
                            <th>Assignment Name</th>
                            <th>Upload Date</th>
                            <th>Due Date</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment) => (
                            <tr key={assignment.assignment_id}>
                                <td>{assignment.assignment_id}</td>
                                <td>{assignment.module_code}</td>
                                <td>{assignment.assign_name}</td>
                                <td>{new Date(assignment.upload_date).toLocaleString()}</td>
                                <td>{new Date(assignment.due_date).toLocaleString()}</td>
                                <td>{assignment.assign_desc}</td>
                                <td>
                                    <button onClick={() => handleEdit(assignment)}>Edit</button>
                                    <button onClick={() => handleDelete(assignment.assignment_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
};

export default AssignmentManagement;
