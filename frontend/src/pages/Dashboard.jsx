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
  
    const [userCounts, setUserCounts] = useState({ lecturers: 0, students: 0 });
    

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

  

   

    useEffect(() => {
        fetchAssignmentCounts();
        fetchUserCounts();
       
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

          

           
        </div>
    );
};

const LecturerDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [students, setStudents] = useState([]);

    const [assignmentCounts, setAssignmentCounts] = useState({ created: 0, submitted: 0 });
   

    // Fetch Assignment Counts
    const fetchAssignmentCounts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/assignment/total');
            setAssignmentCounts(response.data);
        } catch (error) {
            console.error('Error fetching assignment counts:', error);
        }
    };

    // Fetch Video Upload Counts by Hour
   
    // Fetch Grade Distribution
    

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

          

           
        </div>
    );
};

export { AdminDashboard, LecturerDashboard };
