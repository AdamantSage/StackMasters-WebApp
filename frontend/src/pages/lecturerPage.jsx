import React, { useState } from 'react';
import '../index.css';
import ListVideos from './ListVideos';
import ListAssignments from './ListAssignments';
import VideoFeedback from './VideoFeedback';
import CreateAssignment from './CreateAssignment';
import ExportMarks from './exportMarks';
import AssignmentManagement from './AssignmentManagement';
import ProfilePage from './profile';

const LecturerPage = ({user}) => {
    const [activeSection, setActiveSection] = useState('dashboard-overview'); 
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        window.location.href = "/"; 
    };

    const renderSection = () => {
        switch (activeSection) {
            
                case 'profile':
                return <ProfilePage user={user} />;
            case 'list-videos':
                return <ListVideos onSelectVideo={setSelectedVideoId} />;
            case 'list-assignments':
                return <ListAssignments />;
            case 'watch-feedback':
                return <VideoFeedback videoId={selectedVideoId} />;
            case 'create-assignment':
                return <CreateAssignment />;
                case 'export-marks':
                    return <ExportMarks/>;
                    case 'assignment-management':
                        return <AssignmentManagement/>;
                        
                

                
            
        }
    };

    return (
        <div className="user-page">
            <aside className="sidebar">
                <div className="profile-section">
                    <img src="lecturer-profile-pic.jpg" alt="Lecturer" className="profile-pic" />
                    {user ? (
                         <p>Welcome, {userName ? userName : 'Guest'}!</p>
                    ) : (
                        <p className="user-name">Guest</p> // Fallback if no user is logged in
                    )}
                </div>
                <nav className='nav-menu'>
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
                <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </aside>
            <main className="main-content">
                {renderSection()} 
            </main>
        </div>
    );
};

export default LecturerPage;
