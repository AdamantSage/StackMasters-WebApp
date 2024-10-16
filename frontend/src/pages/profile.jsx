import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import '../index.css'; // Ensure this file exists for styling

const ProfilePage = () => {
  const navigate = useNavigate(); // Updated to use useNavigate
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get the user ID from local storage
  const getUserId = () => {
    return localStorage.getItem('userId'); // Assume userId is stored in local storage
  };

  // Fetch user ID and user data on mount
  useEffect(() => {
    const fetchUserId = async () => {
      const id = getUserId(); // Call the getUserId function
      if (id) {
        setUserId(id);
        fetchUserData(id);
      } else {
        alert('Error: User ID is missing. Please log in again.');
        navigate('/sign-in'); // Updated to use navigate
      }
    };
    
    fetchUserId();
  }, [navigate]);

  // Fetch user data when userId is available
  const fetchUserData = async (userId) => {
    console.log('Fetching user data for User ID:', userId);
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        alert('Error: No token found. Please log in again.');
        navigate('/sign-in'); // Updated to use navigate
        return;
      }

      const response = await fetch(`http://192.168.48.255:5000/users/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        alert('Error: ' + (errorData || 'Failed to fetch user data'));
        throw new Error(errorData);
      }

      const data = await response.json();
      setName(data.name);
      setEmail(data.email);
      setRole(data.role);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Error: Unable to fetch user data, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('jwt'); // Remove the JWT token
      localStorage.removeItem('userId'); // Remove the user ID
      navigate('/sign-in'); // Updated to use navigate
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error: Unable to log out, please try again.');
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('jwt');
    if (!userId || !token) {
      alert('Error: User ID or token not found. Please log in again.');
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      alert('Error: Passwords do not match');
      return;
    }

    // Prepare update data (excluding userId)
    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }

    try {
      const response = await fetch(`http://192.168.48.255:5000/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Success: Profile updated successfully');
        // Reset fields
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        fetchUserData(userId);
      } else {
        alert('Error: ' + (data.message || 'Update failed'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error: Unable to update profile, please try again');
    }
  };

  if (isLoading) {
    return (
      <div className="loadingContainer">
        <p className="loadingText">Loading...</p>
      </div>
    );
  }

  return (
    <div className="profileContainer">
      <h1 className="header">Profile</h1>
      <button className="updateButton" onClick={handleUpdateProfile}>
        Update
      </button>
      <button className="logoutButton" onClick={handleLogout}>
        Logout
      </button>

      <input
        className="input"
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <input
        className="input"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <div className="passwordContainer">
        <input
          className="passwordInput"
          type={passwordVisible ? 'text' : 'password'}
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button onClick={() => setPasswordVisible(!passwordVisible)}>
          {passwordVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="passwordContainer">
        <input
          className="passwordInput"
          type={confirmPasswordVisible ? 'text' : 'password'}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <button onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
          {confirmPasswordVisible ? 'Hide' : 'Show'}
        </button>
      </div>

      <p className="label">Role: {role}</p>
    </div>
  );
};

export default ProfilePage;
 