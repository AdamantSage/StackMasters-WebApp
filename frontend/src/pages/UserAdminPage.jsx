import React, { useState, useEffect } from 'react';
import '../index.css';
import ListVideos from './ListVideos';
import ListAssignments from './ListAssignments';
import ExportMarks from './exportMarks';
import { AdminDashboard } from './Dashboard';

import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to your backend socket server

const UserAdminPage = ({ user }) => {  // Accept user prop here
    const [activeSection, setActiveSection] = useState('dashboard'); // Default section
    const [notifications, setNotifications] = useState([]); // State to track notifications

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
            case 'dashboard':
                return <AdminDashboard />;
            case 'list-videos':
                return <ListVideos />;
            case 'list-assignments':
                return <ListAssignments />;
            case 'export-marks':
                return <ExportMarks />;
            case 'system-monitoring':
                return (
                    <section className="system-monitoring">
                        <h2>System Monitoring</h2>
                        {/* Monitoring graphs here */}
                    </section>
                );
            case 'settings':
                return (
                    <section className="settings">
                        <h2>Settings</h2>
                        {/* Settings content here */}
                    </section>
                );
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="user-page">
            {/* Sidebar for navigation */}
            <aside className="sidebar">
                <div className="profile-section">
                    <img src="admin-profile-pic.jpg" alt="Admin" className="profile-pic" />
                    {user ? (
                        <p className="user-name">{user.name} {user.surname}</p>
                    ) : (
                        <p className="user-name">Guest</p> // Fallback if no user is logged in
                    )}
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li><button onClick={() => setActiveSection('dashboard')}>Dashboard</button></li>
                        <li><button onClick={() => setActiveSection('list-assignments')}>List of Assignments</button></li>
                        <li><button onClick={() => setActiveSection('list-videos')}>List of Videos</button></li>
                        <li><button onClick={() => setActiveSection('export-marks')}>Export Marks</button></li>
                        <li><button onClick={() => setActiveSection('system-monitoring')}>System Monitoring</button></li>
                        <li><button onClick={() => setActiveSection('settings')}>Settings</button></li>
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
