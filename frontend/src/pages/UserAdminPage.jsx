// src/pages/UserAdminPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

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
        
      </div>
    </div>
  );
};

export default UserAdminPage;
