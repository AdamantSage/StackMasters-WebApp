import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
                const response = await axios.get('http://localhost:5000/users/users'); 
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
            }
        };
        fetchUsers();
    }, []);

    // Handle user editing
    const handleEdit = (user) => {
        setEditing(true);
        setFormData({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    };

    // Handle user deletion
    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/users/delete/${userId}`);
            setNotification(`User with ID ${userId} deleted successfully`);
            
            // Refresh the list of users
            setUsers(users.filter((user) => user.user_id !== userId));
        } catch (error) {
            setError(`Failed to delete user with ID ${userId}`);
        }
    };

    // Handle form submission for updating user
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/users/update/${formData.user_id}`, {
                name: formData.name,
                email: formData.email,
                role: formData.role
            });
            setNotification('User updated successfully');
            setEditing(false);
            
            // Refresh the list of users
            const updatedUsers = users.map((user) =>
                user.user_id === formData.user_id
                    ? { ...user, name: formData.name, email: formData.email, role: formData.role }
                    : user
            );
            setUsers(updatedUsers);
        } catch (error) {
            setError('Failed to update user');
        }
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
            <div className="page-container">
                {editing && (
                    <form onSubmit={handleSubmit} className="manage-user-form">
                        <input
                            type="hidden"
                            name="user_id"
                            value={formData.user_id}
                        />
                        <div className="input-container">
                            <label className="form-label" htmlFor="userName">
                                Name
                            </label>
                            <input
                                type="text"
                                id="userName"
                                placeholder="Enter user's name"
                                value={formData.name}
                                onChange={(e) => setName(e.target.value)}
                                className="assign-input"
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label className="form-label" htmlFor="userEmail">
                                Email
                            </label>
                            <input
                                type="email"
                                id="userEmail"
                                placeholder="Enter user's email"
                                value={formData.email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="assign-input"
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label className="form-label" htmlFor="userRole">
                                Role
                            </label>
                            <select
                                id="userRole"
                                value={formData.role}
                                onChange={(e) => setRole(e.target.value)}
                                className="assign-input"
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
                        <button onClick={handleCloseNotification} className="close-button">X</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
