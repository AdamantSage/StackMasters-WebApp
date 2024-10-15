import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Example import for your API fetching functions
// import { fetchUsers, updateUser, deleteUser } from '../api'; 

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        email: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Fetch users from the API
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users/users'); // Replace with your API endpoint
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError('Failed to fetch users');
            }
        };
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditing(true);
        setFormData({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    };

    const handleDelete = async (userId) => {
        // Add your delete logic here
        setNotification(`User with ID ${userId} deleted successfully`);
        // Optionally refresh users after deletion
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your update logic here
        setEditing(false);
        setNotification(`User updated successfully`);
        // Optionally refresh users after update
    };

    const setName = (value) => {
        setFormData({ ...formData, name: value });
    };

    const setEmail = (value) => {
        setFormData({ ...formData, email: value });
    };

    const setRole = (value) => {
        setFormData({ ...formData, role: value });
    };

    const handleCloseNotification = () => {
        setNotification('');
    };

    return (
        <div className="page">
            <header>
                <div className="container">
                    <h1 className="page-heading">Manage Users</h1>
                    {error && <p>{error}</p>}
                </div>
            </header>
            <div className="page-Container">
                {editing && (
                    <form onSubmit={handleSubmit} className="manageUserForm">
                        <input
                            type="hidden"
                            name="user_id"
                            value={formData.user_id}
                        />
                        <div className="inputContainer">
                            <label className="form-label" htmlFor="userName">
                                Name
                            </label>
                            <input
                                type="text"
                                id="userName"
                                placeholder="Enter user's name"
                                value={formData.name}
                                onChange={(e) => setName(e.target.value)}
                                className="assign-Input"
                                required
                            />
                        </div>
                        <div className="inputContainer">
                            <label className="form-label" htmlFor="userEmail">
                                Email
                            </label>
                            <input
                                type="email"
                                id="userEmail"
                                placeholder="Enter user's email"
                                value={formData.email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="assign-Input"
                                required
                            />
                        </div>
                        <div className="inputContainer">
                            <label className="form-label" htmlFor="userRole">
                                Role
                            </label>
                            <select
                                id="userRole"
                                value={formData.role}
                                onChange={(e) => setRole(e.target.value)}
                                className="assign-Input"
                                required
                            >
                                <option value="">Select role</option>
                                <option value="Admin">Admin</option>
                                <option value="Lecturer">Lecturer</option>
                                <option value="Student">Student</option>
                            </select>
                        </div>
                        <button type="submit" className="get-started-button">
                            Update User
                        </button>
                    </form>
                )}

                <h2>Existing Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                    <button onClick={() => handleDelete(user.user_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {notification && (
                    <div className="notification">
                        {notification}
                        <button onClick={handleCloseNotification} className="close-button"></button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
