import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        videosUploaded: 0,
        assignmentsCreated: 0,
        assignmentsSubmitted: 0,
        users: { students: 0, lecturers: 0 },
        activeUsers: 0,
    });

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

    const [activeUserChartData, setActiveUserChartData] = useState({
        labels: [], // Will hold time slots (e.g., hours of the day)
        datasets: [
            {
                label: 'Active Users',
                data: [], // Will hold the number of active users at each time slot
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [showActiveUserChart, setShowActiveUserChart] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            const simulatedData = {
                videosUploaded: 10,
                assignmentsCreated: 5,
                assignmentsSubmitted: 4,
                users: { students: 30, lecturers: 10 },
                activeUsers: 15,
            };
            setDashboardData(simulatedData);

            const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
            const dataPoints = [10, 20, 15, 30, 25, 35, 40];

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Videos Uploaded',
                        data: dataPoints,
                        fill: false,
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                    },
                ],
            });
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/users'); // Adjust this endpoint to your actual API
            const userData = await response.json();
            setUsers(userData);
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            `${user.name} ${user.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) && user.submissions.length > 0
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    // Fetch active user data for the chart
    const fetchActiveUserData = () => {
        // Simulated data for active users throughout the day
        const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
        const activeUserCounts = [1, 2, 3, 5, 6, 4, 7, 8, 10, 12, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // Example counts

        setActiveUserChartData({
            labels: times,
            datasets: [
                {
                    label: 'Active Users',
                    data: activeUserCounts,
                    fill: false,
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                },
            ],
        });
    };

    const handleActiveUsersClick = () => {
        fetchActiveUserData(); // Fetch data when the box is clicked
        setShowActiveUserChart(true); // Show the chart
    };

    return (
        <div className="user-dashboard">
            <h2>Dashboard Overview</h2>
            
            {/* Dashboard Summary in Boxes */}
            <div className="dashboard-summary">
                <div className="summary-box">Videos Uploaded: {dashboardData.videosUploaded}</div>
                <div className="summary-box">Assignments Created: {dashboardData.assignmentsCreated}</div>
                <div className="summary-box">Assignments Submitted: {dashboardData.assignmentsSubmitted}</div>
                <div className="summary-box">Students: {dashboardData.users.students}</div>
                <div className="summary-box" onClick={handleActiveUsersClick} style={{ cursor: 'pointer' }}>
                    Active Users: {dashboardData.activeUsers}
                </div>
            </div>

            {/* Search Bar */}
<div className="search-bar-container">
    <input 
        type="text" 
        placeholder="Search by name or surname" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="search-bar" // Add a class for styling
    />
</div>


     

            {/* Active Users Chart */}
            {showActiveUserChart && (
                <div>
                    <h3>Active Users Throughout the Day</h3>
                    <Line data={activeUserChartData} options={{ scales: { y: { beginAtZero: true } } }} />
                </div>
            )}

            <h3>Videos Uploaded Over Time</h3>
            <Line data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
    );

    
};

export const StudentDashboard = () => {

    
        const [dashboardData, setDashboardData] = useState({
            videosUploaded: 0,
            assignmentsCreated: 0,
            assignmentsSubmitted: 0,
            
        });

    return (
        <div>className ="user-dashboard"
            <h2>Student Dashboard</h2>
            <div className="dashboard-summary">
                <div className="summary-box">Videos Uploaded: {dashboardData.videosUploaded}</div>
                <div className="summary-box">Video Feedback: {dashboardData.videoFeedback}</div>
                <div className="summary-box">Assignments Submitted: {dashboardData.assignmentsSubmitted}</div>
                
                
            </div>
        </div>
    );

};


export default {AdminDashboard, StudentDashboard};
