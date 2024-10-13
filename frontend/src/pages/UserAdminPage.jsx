
import React, { useState } from 'react';
import '../index.css';
import ListVideos from './ListVideos';
import ListAssignments from './ListAssignments';
import ExportMarks from './exportMarks';
import { AdminDashboard } from './Dashboard'; 


const UserAdminPage = () => {
    const [activeSection, setActiveSection] = useState('dashboard-overview'); // Default section
    const handleLogout = () => {
        window.location.href = "/"; // Direct to landing page on logout
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'list-videos':
                return <ListVideos />;  // Render the ListVideos component when 'List Videos' is clicked
            case 'list-assignments':
                return <ListAssignments />;
                case 'export-marks':
                    return <ExportMarks/>;
                        
                    
                case 'video-management':
                    return (
                        <section className="video-management">
                            <h2>Video Management</h2>
                            {/* Video Management content here */}
                        </section>
                    );
                case 'system-monitoring':
                    return (
                        <section className="system-monitoring">
                            <h2>System Monitoring</h2>
                            {/* Monitoring graphs here */}
                        </section>
                    );
                    case 'user-management':
                        return (
                            <section className="user-management">
                                <h2>User Management</h2>
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
                <p className="user-name">John Doe</p>
                </div>
                <nav className='nav-menu'>
                <ul>
                    <li><button onClick={() => setActiveSection('dashboard')}>Dashboard</button></li>
                    <li><button onClick={() => setActiveSection('list-assignments')}>List of Assignments</button></li>
                    <li><button onClick={() => setActiveSection('list-videos')}>List of Videos</button></li>
                    <li><button onClick={() => setActiveSection('export-marks')}>Export Marks</button></li>
                    <li><button onClick={() => setActiveSection('user-management')}>User Management</button></li>
                    <li><button onClick={() => setActiveSection('system-monitoring')}>System Monitoring</button></li>
                    <li><button onClick={() => setActiveSection('settings')}>Settings</button></li>
                </ul>
                </nav>
                 {/* Logout Button at the Tbottom left corner */}
             <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </aside>

            {/* Main content area where different sections will be rendered */}
            <main className="main-content">
                {renderSection()}  {/* Call renderSection to display the selected section */}
            </main>

           
        </div>
    );
};

export default UserAdminPage;
