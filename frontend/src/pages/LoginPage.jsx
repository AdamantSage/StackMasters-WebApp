import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paper from 'paper';
import '../index.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [emailSignup, setEmailSignup] = useState('');
  const [usernameSignup, setUsernameSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Paper.js animations
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

  // Signup handler
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!emailSignup || !passwordSignup || !confirmPassword || !usernameSignup) {
        setError('Please fill in all fields!');
        return;
    }

    if (passwordSignup !== confirmPassword) {
        setError('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch('https://hmsstackmasters-hvfcb8drb4d0egf8.southafricanorth-01.azurewebsites.net//users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: usernameSignup,
                role: role,
                email: emailSignup,
                password: passwordSignup,
                passwordConfirm: confirmPassword,
            }),
        });

        // Check if the response is okay (status 200-299)
        if (!response.ok) {
            const errorData = await response.text(); // Get the response text
            console.error('Error response:', errorData); // Log for debugging

            // Check if the error response is JSON
            try {
                const jsonData = JSON.parse(errorData);
                setError(jsonData.message || 'Signup failed'); // Use the error message from the server
            } catch (e) {
                setError('Error creating user: ' + errorData); // Fallback for non-JSON errors
            }
            return;
        }

        const data = await response.json();
        console.log('Signup successful:', data);
        alert('User has been created successfully!'); // Show pop-up notification
        window.location.reload(); // Refresh the page
        navigate('/login'); // Redirect to login after signup

    } catch (error) {
        console.error('Error occurred:', error);
        setError('An unexpected error occurred. Please try again later.');
    }
};



  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!usernameLogin || !passwordLogin) {
      setError('Please fill in both username and password!');
      return;
    }

    try {
      const response = await fetch('https://hmsstackmasters-hvfcb8drb4d0egf8.southafricanorth-01.azurewebsites.net/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: usernameLogin, password: passwordLogin }),
      });

      const data = await response.json();
      console.log(data); // Debugging the response data

      if (response.ok) {
        if (data.userId) {
          // Store JWT and user data
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('userId', JSON.stringify(data.userId));
          localStorage.setItem('userName', data.name);

          const userRole = data.role;
          // Role-based redirection
          switch (userRole) {
            case 'admin':
              navigate('/user-admin');
              break;
            case 'lecturer':
              navigate('/user-lecturer');
              break;
            case 'student':
              navigate('/profile');
              break;
            default:
              setError('Unrecognized role.');
          }
        } else {
          setError('User ID is not available.');
        }
      } else {
        setError(response.status === 401 ? 'Incorrect username or password.' : data.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setError('Unable to connect. Please check your internet connection.');
    }
  };

  // Switch between signup and login forms
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
              <form id="form-signup" onSubmit={handleSignUp}>
                <div className="form-element form-stack">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
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
              {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
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
              {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

