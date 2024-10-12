import React, { useState } from 'react';
import '../index.css';
import ListVideos from './ListVideos';
import ListAssignments from './ListAssignments';
import VideoFeedback from './VideoFeedback';
import CreateAssignment from './CreateAssignment';
import { LecturerDashboard } from './Dashboard'; 

const LecturerPage = () => {
    const [activeSection, setActiveSection] = useState('dashboard-overview'); 
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const handleLogout = () => {
        window.location.href = "/"; 
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <LecturerDashboard />;
            case 'list-videos':
                return <ListVideos onSelectVideo={setSelectedVideoId} />;
            case 'list-assignments':
                return <ListAssignments />;
            case 'watch-feedback':
                return <VideoFeedback videoId={selectedVideoId} />;
            case 'create-assignment':
                return <CreateAssignment />;
                case 'settings':
                    return (
                        <section className="settings">
                            <h2>Settings</h2>
                            {/* Settings content here */}
                        </section>
                    );
            default:
                return <LecturerDashboard />;
        }
    };

    return (
        <div className="user-page">
            <aside className="sidebar">
                <div className="profile-section">
                    <img src="lecturer-profile-pic.jpg" alt="Admin" className="profile-pic" />
                    <p className="user-name">John Doe</p>
                </div>
                <nav className='nav-menu'>
                    <ul>
                        <li><button onClick={() => setActiveSection('dashboard')}>LecturerDashboard</button></li>
                        <li><button onClick={() => setActiveSection('list-assignments')}>List of Assignments</button></li>
                        <li><button onClick={() => setActiveSection('list-videos')}>List of Videos</button></li>
                        <li><button onClick={() => setActiveSection('create-assignment')}>Create Assignment</button></li>
                        <li><button onClick={() => setActiveSection('watch-feedback')}>Video Feedback</button></li>
                        <li><button onClick={() => setActiveSection('settings')}>Settings</button></li>
                    </ul>
                </nav>
                <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </aside>
            <main className="main-content">
                {renderSection()} 
            </main>
        </div>
    );
};

export default LecturerPage;
