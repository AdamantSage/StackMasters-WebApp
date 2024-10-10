import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Ensure you have the CSS file for styling

const UserAdminPage = () => {
    return (
        <div className="page">
            <header>
                <div className="container">
                    <h1 className="page-heading">User Administration Page</h1>
                    <ul className="linksList">
                        <li>
                            <Link to="/" className="link">Landing Page</Link>
                        </li>
                        <li>
                            <Link to="/list-assignments" className="link">List Assignments</Link>
                        </li>
                        <li>
                            <Link to="/create-assignment" className="link">Create Assignment</Link>
                        </li>
                    </ul>
                </div>
            </header>

            <div className="page-Container">
                {/* Navigation Bar */}
                <nav className="navbar">
                    <div className="navbar-left">
                        <img src="admin-profile-pic.jpg" alt="Admin" className="profile-image" />
                        <span className="admin-name">Admin Name</span>
                    </div>
                    <ul className="navbar-links">
                        <li>User Management</li>
                        <li>Video Management</li>
                        <li>System Monitoring</li>
                        <li>Settings</li>
                    </ul>
                    <div className="profile-dropdown">
                        <button className="dropdown-button">Profile ▼</button>
                        <div className="dropdown-content">
                            <span>Log Out</span>
                        </div>
                    </div>
                </nav>

                {/* Dashboard Overview Section */}
                <section className="dashboard-overview">
                    <h2>Dashboard Overview</h2>
                    <div className="metrics">
                        <div className="metric">
                            <h3>Active Users</h3>
                            <p>50 Students, 10 Lecturers</p>
                        </div>
                        <div className="metric">
                            <h3>Uploaded Videos</h3>
                            <p>120 Videos</p>
                        </div>
                        <div className="metric">
                            <h3>System Health</h3>
                            <p>CPU: 45%, Storage: 80%</p>
                        </div>
                    </div>
                </section>

                {/* User Management Section */}
                <section className="user-management">
                    <h2>User Management</h2>
                    <input type="text" placeholder="Search Users" className="search-bar" />
                    <select className="filter-role">
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="student">Student</option>
                    </select>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Example row */}
                            <tr>
                                <td>John Doe</td>
                                <td>Student</td>
                                <td>Active</td>
                                <td>2024-10-10</td>
                                <td>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                            {/* More rows can be added */}
                        </tbody>
                    </table>
                </section>

                {/* Video Management Section */}
                <section className="video-management">
                    <h2>Video Management</h2>
                    <table className="video-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Assignment Title</th>
                                <th>Upload Date</th>
                                <th>Review Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Example row */}
                            <tr>
                                <td>Jane Smith</td>
                                <td>Assignment 1</td>
                                <td>2024-10-05</td>
                                <td>Pending</td>
                                <td>
                                    <button>View</button>
                                    <button>Tag</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                            {/* More rows can be added */}
                        </tbody>
                    </table>
                </section>

                {/* System Monitoring Section */}
                <section className="system-monitoring">
                    <h2>System Monitoring</h2>
                    {/* System health graphs can be integrated here */}
                    <div className="graphs">
                        <div className="graph">CPU Usage Graph</div>
                        <div className="graph">Active Users Graph</div>
                        <div className="graph">Video Submissions Graph</div>
                    </div>
                </section>

                {/* Settings Section */}
                <section className="settings">
                    <h2>Settings</h2>
                    <h3>File Upload Settings</h3>
                    <p>Max upload size: 500MB</p>
                    <h3>User Role Settings</h3>
                    <p>Manage user permissions here.</p>
                    <h3>System Security Settings</h3>
                    <p>Manage API keys and access logs.</p>
                </section>
            </div>
        </div>
    );
};

export default UserAdminPage;
