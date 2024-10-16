import React, { useState, useEffect } from 'react';
import '../index.css';
import ListVideos from './ListVideos';
import ListAssignments from './ListAssignments';
import ExportMarks from './exportMarks';
import AssignmentManagement from './AssignmentManagement';
import VideoFeedback from './VideoFeedback';
import CreateAssignment from './CreateAssignment';
import ProfilePage from './profile';

import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom'; // For navigation in case of error

const socket = io('http://localhost:5000'); // Connect to your backend socket server

const UserAdminPage = ({ user }) => {  
    const [activeSection, setActiveSection] = useState('dashboard'); // Default section
    const [notifications, setNotifications] = useState([]); // State to track notifications
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [name, setName] = useState(''); // New state for storing the user's name
    const navigate = useNavigate();

    const getUserId = () => {
        return localStorage.getItem('userId'); // Fetch userId from local storage
    };

    const fetchUserData = async (userId) => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                alert('Error: No token found. Please log in again.');
                navigate('/sign-in'); // Redirect to sign-in page if no token
                return;
            }

            const response = await fetch(`http://localhost:5000/users/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                alert('Error: ' + (errorData || 'Failed to fetch user data'));
                throw new Error(errorData);
            }

            const data = await response.json();
            setName(data.name); // Set the name from the fetched user data
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Error: Unable to fetch user data, please try again');
        }
    };

    useEffect(() => {
        const userId = getUserId(); // Fetch the userId
        if (userId) {
            fetchUserData(userId); // Fetch user data when component mounts
        } else {
            alert('Error: User ID is missing. Please log in again.');
            navigate('/sign-in');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
        window.location.href = "/"; // Redirect to landing page on logout
    };

    // Handle real-time socket notifications
    useEffect(() => {
        socket.on('assignmentUpdated', (assignment) => {
            setNotifications((prev) => [...prev, `Assignment updated: ${assignment.title}`]);
        });

        socket.on('videoUploadSuccess', (data) => {
            setNotifications((prev) => [...prev, `${data.message} at ${data.timestamp}`]);
        });

        socket.on('videoCompressionSuccess', (data) => {
            setNotifications((prev) => [...prev, `${data.message} at ${data.timestamp}`]);
        });

        return () => {
            socket.off('assignmentUpdated');
            socket.off('videoUploadSuccess');
            socket.off('videoCompressionSuccess');
        };
    }, []);

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfilePage user={user} />;
            case 'list-videos':
                return <ListVideos />;
            case 'list-assignments':
                return <ListAssignments />;
            case 'watch-feedback':
                return <VideoFeedback videoId={selectedVideoId} />;
            case 'create-assignment':
                return <CreateAssignment />;
            case 'export-marks':
                return <ExportMarks />;
            case 'assignment-management':
                return <AssignmentManagement />;
            default:
                return null;
        }
    };

    return (
        <div className="user-page">
            {/* Sidebar for navigation */}
            <aside className="sidebar">
                <div className="profile-section">
            
                    {name ? (
                        <p>Welcome, {name}!</p> // Display the fetched user name
                    ) : (
                        <p>Loading user info...</p>
                    )}
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li><button onClick={() => setActiveSection('profile')}>Profile</button></li>
                        <li><button onClick={() => setActiveSection('list-assignments')}>List of Assignments</button></li>
                        <li><button onClick={() => setActiveSection('list-videos')}>List of Videos</button></li>
                        <li><button onClick={() => setActiveSection('create-assignment')}>Create Assignment</button></li>
                        <li><button onClick={() => setActiveSection('watch-feedback')}>Video Feedback</button></li>
                        <li><button onClick={() => setActiveSection('export-marks')}>Export Marks</button></li>
                        <li><button onClick={() => setActiveSection('assignment-management')}>Assignment Management</button></li>
                    </ul>
                </nav>
                {/* Logout Button */}
                <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </aside>
            {/* Main content area where different sections will be rendered */}
            <main className="main-content">
                {renderSection()}
            </main>

            {/* Notification area */}
            <div className="notification-area">
                {notifications.map((notification, index) => (
                    <div key={index} className="notification">
                        {notification}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserAdminPage;
