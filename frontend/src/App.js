import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UserAdminPage from './pages/UserAdminPage';
import ListAssignments from './pages/ListAssignments';
import CreateAssignment from './pages/CreateAssignment';
import ListVideos from './pages/ListVideos';
import VideoFeedback from './pages/VideoFeedback';
import LecturerPage from './pages/lecturerPage';
import ExportMarks from './pages/exportMarks';
import AssignmentManagement from './pages/AssignmentManagement';
import ProfilePage from './pages/profile';



import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-admin" element={<UserAdminPage />} />
        <Route path="/list-assignments" element={<ListAssignments />} />
        <Route path="/create-assignment" element={<CreateAssignment />} />
        <Route path="/list-videos" element={<ListVideos />} />
        <Route path="/watch-feedback/:id" element={<VideoFeedback />} />
        <Route path="/user-lecturer" element={<LecturerPage />} />
        <Route path="/export-marks" element={<ExportMarks />} />
        <Route path="/assignment-management" element={<AssignmentManagement />} />
        <Route path="/profile" element={<ProfilePage />} />
        
      </Routes>
    </Router>
  );
};

export default App;
