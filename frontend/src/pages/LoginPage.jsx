import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paper from 'paper';
import '../index.css';

const LoginPage = () => {
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [usernameSignup, setUsernameSignup] = useState('');
  const [emailSignup, setEmailSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    // Handle signup logic (replace with your API logic)
    console.log('Sign Up form submitted', { emailSignup, usernameSignup, passwordSignup });
    
    // Mock API response for signup (replace with real API call)
    const response = await mockApiSignUp(emailSignup, usernameSignup, passwordSignup);
    
    if (response.success) {
      console.log('Signup successful');
      // Optionally navigate or provide feedback
    } else {
      setError('Signup failed');
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Mock API request to verify login (replace this with actual API call)
    const response = await mockApiLogin(usernameLogin, passwordLogin);  // Use a real API call here

    if (response.success) {
      const userRole = response.role; // Get the role from the response (Admin, Lecturer, Student)
      
      // Navigate based on user role
      if (userRole === 'Admin') {
        navigate('/user-admin');
      } else if (userRole === 'Lecturer') {
        navigate('/user-lecturer'); // page for Lecturer
      } else if (userRole === 'Student') {
        navigate('/user-student'); // page for Student
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

   // Mock API call for signup - replace this with a real API call
   const mockApiSignUp = (email, username, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && username && password) {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      }, 1000);
    });
  };

  const goToSignUp = () => {
    document.getElementById('slideBox').style.marginLeft = '0';
    document.querySelector('.topLayer').style.marginLeft = '100%';
  };

  const goToLogin = () => {
    document.getElementById('slideBox').style.marginLeft = window.innerWidth > 769 ? '50%' : '20%';
    document.querySelector('.topLayer').style.marginLeft = '0';
  };

  

  return (
    <div id="back">
      <canvas id="canvas" className="canvas-back"></canvas>
      <div className="backRight"></div>
      <div className="backLeft"></div>

      <div id="slideBox">
        <div className="topLayer">
          <div className="left">
            <div className="content">
              <h2>Sign Up</h2>
              <form id="form-signup" method="post" onSubmit={handleSignUp}>
                <div className="form-element form-stack">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={emailSignup}
                    onChange={(e) => setEmailSignup(e.target.value)}
                  />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="username-signup" className="form-label">Username</label>
                  <input
                    id="username-signup"
                    type="text"
                    name="username"
                    required
                    value={usernameSignup}
                    onChange={(e) => setUsernameSignup(e.target.value)}
                  />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="password-signup" className="form-label">Password</label>
                  <input
                    id="password-signup"
                    type="password"
                    name="password"
                    required
                    value={passwordSignup}
                    onChange={(e) => setPasswordSignup(e.target.value)}
                  />
                </div>
                <div className="form-element form-checkbox">
                  <input id="confirm-terms" type="checkbox" name="confirm" value="yes" className="checkbox" required />
                  <label htmlFor="confirm-terms">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </label>
                </div>
                <div className="form-element form-submit">
                  <button id="signUp" className="signup" type="submit" name="signup">Sign up</button>
                  <button type="button" id="goLeft" className="signup off" onClick={goToLogin}>Log In</button>
                </div>
              </form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
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
                    value={usernameLogin}
                    onChange={(e) => setUsernameLogin(e.target.value)}
                  />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="password-login" className="form-label">Password</label>
                  <input
                    id="password-login"
                    type="password"
                    name="password"
                    required
                    value={passwordLogin}
                    onChange={(e) => setPasswordLogin(e.target.value)}
                  />
                </div>
                <div className="form-element form-submit">
                  <button id="logIn" className="login" type="submit" name="login">Log In</button>
                  <button type="button" id="goRight" className="login off" onClick={goToSignUp}>Sign Up</button>
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