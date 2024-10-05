// src/pages/LoginPage.jsx
import React, { useEffect } from 'react';
import paper from 'paper';
import { Link } from 'react-router-dom';
import '../index.css'; // Include your main CSS file

const LoginPage = () => {
  useEffect(() => {
    // Handle Paper.js animation setup here
    paper.install(window);
    paper.setup(document.getElementById('canvas'));
    initializeShapes();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const initializeShapes = () => {
    // Paper.js shapes logic (example)
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
    // Canvas resizing logic
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle signup logic
    console.log('Sign Up form submitted');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic
    console.log('Login form submitted');
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
                  <input id="email" type="email" name="email" required />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="username-signup" className="form-label">Username</label>
                  <input id="username-signup" type="text" name="username" required />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="password-signup" className="form-label">Password</label>
                  <input id="password-signup" type="password" name="password" required />
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
            </div>
          </div>
          <div className="right">
            <div className="content">
              <h2>Login</h2>
              <form id="form-login" method="post" onSubmit={handleLogin}>
                <div className="form-element form-stack">
                  <label htmlFor="username-login" className="form-label">Username</label>
                  <input id="username-login" type="text" name="username" required />
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="password-login" className="form-label">Password</label>
                  <input id="password-login" type="password" name="password" required />
                </div>
                <div className="form-element form-submit">
                  <button id="logIn" className="login" type="submit" name="login">Log In</button>
                  <button type="button" id="goRight" className="login off" onClick={goToSignUp}>Sign Up</button>
                </div>
              </form>
              {/* Navigation Links to Other Pages */}
              <div className="links-container">
                <Link to="/" className="link">Landing Page</Link>
                <Link to="/user-admin" className="link">User Administration</Link>
                <Link to="/list-assignments" className="link">List Assignments</Link>
                <Link to="/create-assignment" className="link">Create Assignment</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
