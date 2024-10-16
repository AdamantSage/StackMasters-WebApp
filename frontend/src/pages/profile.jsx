import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css'; // line for external CSS

const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const[password,setPassword]= useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users'); //  API route to fetch users
                const { name, email, password } = response.data;

                setName(name);
                setEmail(email);
                setPassword(password);
            } catch (err) {
                setError('Error fetching user details.');
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put('http://localhost:5000/profile', {
                name,
                email,
                newPassword,
                confirmPassword
            });

            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
            setMessage('');
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
               

                {/* User Details Summary Box */}
                <div className="summary-box">
                    <h2>Your Current Details</h2>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Password:</strong> ******</p> {/* Mask the password */}
                </div>
                <h1>Update Profile</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            className="styled-input"
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="styled-input"
                        />
                    </div>
                    <div>
                        <label>New Password:</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            className="styled-input"
                        />
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="styled-input"
                        />
                    </div>
                    <button type="submit" className="styled-button">Update Profile</button>
                </form>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default ProfilePage;
