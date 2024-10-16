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

const socket = io('http://localhost:5000'); // Connect to your backend socket server

const UserAdminPage = ({ user }) => {  // Accept user prop here
    const [activeSection, setActiveSection] = useState('dashboard'); // Default section
    const [notifications, setNotifications] = useState([]); // State to track notifications
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
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

        // Cleanup socket listeners on component unmount
        return () => {
            socket.off('assignmentUpdated');
            socket.off('videoUploadSuccess');
            socket.off('videoCompressionSuccess');
        };
    }, []);

    // Render different sections based on active button
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
                   
                       
            
            
              
           
        }
    };

    return (
        <div className="user-page">
            {/* Sidebar for navigation */}
            <aside className="sidebar">
                <div className="profile-section">
                    <img src="admin-profile-pic.jpg" alt="Admin" className="profile-pic" />
                    {user ? (
                         <p>Welcome, {userName ? userName : 'Guest'}!</p>
                    ) : (
                        <p className="user-name">Guest</p> // Fallback if no user is logged in
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
