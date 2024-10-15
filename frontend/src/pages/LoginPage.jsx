import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paper from 'paper';
import '../index.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons

const LoginPage = () => {
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [emailSignup, setEmailSignup] = useState('');
  const [usernameSignup, setUsernameSignup] = useState(''); // Added username for signup
  const [passwordSignup, setPasswordSignup] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password state
  const [role, setRole] = useState('admin'); // Default role
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false); // State for login password visibility
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

    // Check for empty fields
    if (!emailSignup || !passwordSignup || !confirmPassword || !usernameSignup) {
      setError('Please fill in all fields!');
      return;
    }

    // Validate password confirmation
    if (passwordSignup !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailSignup,
          username: usernameSignup,
          password: passwordSignup,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful');
        navigate('/login'); // Redirect to login page after successful signup
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!usernameLogin || !passwordLogin) {
        setError('Please fill in both username and password!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usernameLogin)) {
        setError('Please enter a valid email address!');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: usernameLogin, password: passwordLogin }),
        });

        const data = await response.json();
        console.log(data); // Log the response data

        if (response.ok) {
            if (data.userId) {
                localStorage.setItem('jwt', data.token);
                localStorage.setItem('userId', JSON.stringify(data.userId));
                localStorage.setItem('userName', data.name); // Store the user's name

                const userRole = data.role;
                switch (userRole) {
                    case 'Admin':
                        navigate('/user-admin');
                        break;
                    case 'Lecturer':
                        navigate('/user-lecturer');
                        break;
                    case 'Student':
                        navigate('/profile'); // Redirect to profile page for Student
                        break;
                    default:
                        setError('Role is not recognized.');
                }
            } else {
                setError('User ID is not available.');
            }
        } else {
            // Check for specific error messages based on response status
            if (response.status === 401) {
                setError('Incorrect username or password.');
            } else {
                setError(data.message || 'An unexpected error occurred.');
            }
        }
    } catch (error) {
        console.error('Error occurred:', error);
        setError('Unable to connect. Please check your internet connection and try again.');
    }
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
                  <div className="password-input">
                    <input
                      id="password-signup"
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      required
                      value={passwordSignup}
                      onChange={(e) => setPasswordSignup(e.target.value)}
                    />
                    <span onClick={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                  <div className="password-input">
                    <input
                      id="confirm-password"
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="form-element form-stack">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="lecturer">Lecturer</option>
                  </select>
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
                  <div className="password-input">
                    <input
                      id="password-login"
                      type={loginPasswordVisible ? 'text' : 'password'}
                      name="password"
                      required
                      value={passwordLogin}
                      onChange={(e) => setPasswordLogin(e.target.value)}
                    />
                    <span onClick={() => setLoginPasswordVisible(!loginPasswordVisible)}>
                      {loginPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="form-element form-submit">
                  <button id="login" className="login" type="submit" name="login">Log in</button>
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
