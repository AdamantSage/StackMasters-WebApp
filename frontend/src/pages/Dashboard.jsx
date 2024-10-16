import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 

Chart.register(...registerables);

const AdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [users, setUsers] = useState([]);

    const [assignmentCounts, setAssignmentCounts] = useState({ created: 0, submitted: 0 });
    const [gradeData, setGradeData] = useState({ labels: [], datasets: [] });
    const [userCounts, setUserCounts] = useState({ lecturers: 0, students: 0 });
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Videos Uploaded',
                data: [],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    });

    const fetchAssignmentCounts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/assignment/counts');
            setAssignmentCounts(response.data); // Assuming response data has { created, submitted }
        } catch (error) {
            console.error('Error fetching assignment counts:', error);
        }
    };

    const fetchUserCounts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/counts');
            setUserCounts(response.data);
        } catch (error) {
            console.error('Error fetching user counts:', error);
        }
    };

    const fetchVideoCountsByHour = async () => {
        try {
            const response = await axios.get('http://localhost:5000/videos/hour');
            const hours = response.data.map(item => item.upload_hour);
            const counts = response.data.map(item => item.video_count);

            setChartData({
                labels: hours,
                datasets: [
                    {
                        label: 'Videos Uploaded',
                        data: counts,
                        fill: false,
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching video counts:', error);
        }
    };

    const fetchGradeDistribution = async () => {
        try {
            const response = await axios.get('http://localhost:5000/grades-distribution');
            const modules = response.data.map(item => `Module ${item.assignment_id}`);
            const gradeRanges = {
                '0-50': response.data.map(item => item['0-50']),
                '51-70': response.data.map(item => item['51-70']),
                '71-85': response.data.map(item => item['71-85']),
                '86-100': response.data.map(item => item['86-100']),
            };

            setGradeData({
                labels: modules,
                datasets: [
                    {
                        label: '0-50%',
                        data: gradeRanges['0-50'],
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    },
                    {
                        label: '51-70%',
                        data: gradeRanges['51-70'],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    },
                    {
                        label: '71-85%',
                        data: gradeRanges['71-85'],
                        backgroundColor: 'rgba(255, 206, 86, 0.6)',
                    },
                    {
                        label: '86-100%',
                        data: gradeRanges['86-100'],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching grade distribution:', error);
        }
    };

    useEffect(() => {
        fetchAssignmentCounts();
        fetchUserCounts();
        fetchVideoCountsByHour();
        fetchGradeDistribution();
    }, []);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = users.filter(user => {
            const fullName = `${user.name} ${user.surname}`.toLowerCase();
            return (
                user.user_id.toString().includes(lowercasedSearchTerm) || // Search by user ID
                fullName.includes(lowercasedSearchTerm) // Search by full name
            );
        });
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    // Function to highlight the search term
    const highlightSearchTerm = (text) => {
        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) => (
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <span key={index} className="highlight">{part}</span>
            ) : (
                part
            )
        ));
    };

    return (
        <div className="user-dashboard">
            <h2>Admin Dashboard Overview</h2>

            <div className="dashboard-summary">
                <div className="summary-box">
                    <h2>Assignment Summary</h2>
                    <p>Assignments Created: {assignmentCounts.created}</p>
                    <p>Assignments Submitted: {assignmentCounts.submitted}</p>
                </div>
                <div className="summary-box">
                    <h3>Lecturers</h3>
                    <p>{userCounts.lecturers}</p>
                </div>
                <div className="summary-box">
                    <h3>Students</h3>
                    <p>{userCounts.students}</p>
                </div>
            </div>

            <input
                className="search-bar" // Add this class for styling
                type="text"
                placeholder="Search by User ID or Name/Surname"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            <ul className="user-list">
                {filteredUsers.map(user => (
                    <li key={user.user_id}>
                        {highlightSearchTerm(`${user.name} ${user.surname}`)} (ID: {user.user_id})
                    </li>
                ))}
            </ul>

            <div>
                <h2>Video Upload Counts by Hour</h2>
                <Bar
                    data={chartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>

            <div>
                <h2>Grade Distribution by Module</h2>
                <Bar
                    data={gradeData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Students',
                                },
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Modules',
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

const LecturerDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [students, setStudents] = useState([]);

    const [assignmentCounts, setAssignmentCounts] = useState({ created: 0, submitted: 0 });
    const [videoCounts, setVideoCounts] = useState({ labels: [], datasets: [] });
    const [gradeData, setGradeData] = useState({ labels: [], datasets: [] });

    // Fetch Assignment Counts
    const fetchAssignmentCounts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/assignment/counts');
            setAssignmentCounts(response.data);
        } catch (error) {
            console.error('Error fetching assignment counts:', error);
        }
    };

    // Fetch Video Upload Counts by Hour
    const fetchVideoCountsByHour = async () => {
        try {
            const response = await axios.get('http://localhost:5000/videos/hour');
            const hours = response.data.map(item => `${item.hour}:00`);
            const videoUploads = response.data.map(item => item.uploadCount);

            setVideoCounts({
                labels: hours,
                datasets: [
                    {
                        label: 'Videos Uploaded',
                        data: videoUploads,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching video counts by hour:', error);
        }
    };

    // Fetch Grade Distribution
    const fetchGradeDistribution = async () => {
        try {
            const response = await axios.get('http://localhost:5000/grades-distribution');
            const modules = response.data.map(item => `Module ${item.assignment_id}`);
            const gradeRanges = {
                '0-50': response.data.map(item => item['0-50']),
                '51-70': response.data.map(item => item['51-70']),
                '71-85': response.data.map(item => item['71-85']),
                '86-100': response.data.map(item => item['86-100']),
            };

            setGradeData({
                labels: modules,
                datasets: [
                    {
                        label: '0-50%',
                        data: gradeRanges['0-50'],
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    },
                    {
                        label: '51-70%',
                        data: gradeRanges['51-70'],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    },
                    {
                        label: '71-85%',
                        data: gradeRanges['71-85'],
                        backgroundColor: 'rgba(255, 206, 86, 0.6)',
                    },
                    {
                        label: '86-100%',
                        data: gradeRanges['86-100'],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching grade distribution:', error);
        }
    };

    // Fetch students for searching
    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    // Handle Search for Students by User ID
    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = students.filter(user => 
            user.user_id.toString().includes(lowercasedSearchTerm)
        );
        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    // Fetch data on initial load
    useEffect(() => {
        fetchAssignmentCounts();
        fetchVideoCountsByHour();
        fetchGradeDistribution();
        fetchStudents();
    }, []);

    const highlightSearchTerm = (text) => {
        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) => (
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <span key={index} className="highlight">{part}</span>
            ) : (
                part
            )
        ));
    };

    return (
        <div className="lecturer-dashboard">
            <h2>Lecturer Dashboard Overview</h2>

            <div className="dashboard-summary">
                <div className="summary-box">
                    <h2>Assignment Summary</h2>
                    <p>Assignments Created: {assignmentCounts.created}</p>
                    <p>Assignments Submitted: {assignmentCounts.submitted}</p>
                </div>
            </div>

            <input
                className="search-bar"
                type="text"
                placeholder="Search by User ID or Name/Surname"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            <ul className="user-list">
                {filteredStudents.map(user => (
                    <li key={user.user_id}>
                        {highlightSearchTerm(`${user.name} ${user.surname}`)} (ID: {user.user_id})
                    </li>
                ))}
            </ul>

            <div>
                <h2>Video Upload Counts by Hour</h2>
                <Bar
                    data={videoCounts}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Videos',
                                },
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time of Day (Hour)',
                                },
                            },
                        },
                    }}
                />
            </div>

            <div>
                <h2>Grade Distribution by Module</h2>
                <Bar
                    data={gradeData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Students',
                                },
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Modules',
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export { AdminDashboard, LecturerDashboard };
