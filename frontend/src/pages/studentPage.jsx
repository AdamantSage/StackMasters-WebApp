import React, { useState } from 'react';
import '../index.css';
import ListVideos from './ListVideos';
import ListAssignments from './ListAssignments';
import { StudentDashboard } from './Dashboard'; // Adjust the path if necessary


const StudentPage = () => {
    const [activeSection, setActiveSection] = useState('dashboard-overview'); // Default section

    const handleLogout = () => {
        window.location.href = "/"; // Direct to landing page on logout
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'student-dashboard':
                return <StudentDashboard />; // Correct usage of StudentDashboard
            case 'list-videos':
                return <ListVideos />;
            case 'list-assignments':
                return <ListAssignments />;
            
            case 'settings':
                return (
                    <section className="settings">
                        <h2>Settings</h2>
                        {/* Settings content here */}
                    </section>
                );
            default:
                return <StudentDashboard />; // Default to StudentDashboard
        }
    };

    return (
        <div className="user-page">
            {/* Sidebar for navigation */}
            <aside className="sidebar">
                <div className="profile-section">
                    <img src="student-profile-pic.jpg" alt="Student" className="profile-pic" />
                    <p className="user-name">John Doe</p>
                </div>
                <nav className='nav-menu'>
                    <ul>
                        <li><button onClick={() => setActiveSection('student-dashboard')}>Dashboard Overview</button></li>
                        <li><button onClick={() => setActiveSection('list-assignments')}>List of Assignments</button></li>
                        <li><button onClick={() => setActiveSection('list-videos')}>List of Videos</button></li>
                        <li><button onClick={() => setActiveSection('settings')}>Settings</button></li>
                    </ul>
                </nav>
                {/* Logout Button at the bottom left corner */}
                <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </aside>

            {/* Main content area where different sections will be rendered */}
            <main className="main-content">
                {renderSection()}  {/* Call renderSection to display the selected section */}
            </main>
        </div>
    );
};

export default StudentPage;
