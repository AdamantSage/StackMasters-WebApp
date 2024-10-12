import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paper from 'paper';
import '../index.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Paper.js animation setup
    paper.install(window);
    paper.setup(document.getElementById('canvas'));
    initializeShapes();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const initializeShapes = () => {
    const circle = new paper.Path.Circle({
      center: paper.view.center,
      radius: 50,
      fillColor: 'blue'
    });
    paper.view.onFrame = () => {
      circle.rotate(1);
    };
  };

  const onResize = () => {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Mock API request to verify login (replace this with actual API call)
    const response = await mockApiLogin(username, password); // Use a real API call here

    if (response.success) {
      const userRole = response.role; // Get the role from the response (Admin, Lecturer, Student)
      
      // Navigate based on user role
      if (userRole === 'Admin') {
        navigate('/user-admin');
      } else if (userRole === 'Lecturer') {
        navigate('/list-assignments'); // or any page for Lecturer
      } else if (userRole === 'Student') {
        navigate('/user-student'); // Create a student dashboard or assignments page
      }
    } else {
      setError('Invalid username or password');
    }
  };

  // Mock API call for login - replace this with a real API call
  const mockApiLogin = (username, password) => {
    // Replace this logic with your backend API request
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
          resolve({ success: true, role: 'Admin' });
        } else if (username === 'lecturer' && password === 'lecturer') {
          resolve({ success: true, role: 'Lecturer' });
        } else if (username === 'student' && password === 'student') {
          resolve({ success: true, role: 'Student' });
        } else {
          resolve({ success: false });
        }
      }, 1000);
    });
  };

  return (
    <div id="back">
      <canvas id="canvas" className="canvas-back"></canvas>
      <div className="backRight"></div>
      <div className="backLeft"></div>

      <div id="slideBox">
        <div className="topLayer">
          <div className="right">
            <div className="content">
              <h2>Login</h2>
              <form id="form-login" method="post" onSubmit={handleLogin}>
                <div className="form-element form-stack">
                  <label htmlFor="username-login" className="form-label">Username</label>
                  <input
                    id="username-login"
                    type="text"
                    name="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="password-login" className="form-label">Password</label>
                  <input
                    id="password-login"
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-element form-submit">
                  <button id="logIn" className="login" type="submit" name="login">Log In</button>
                </div>
              </form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
