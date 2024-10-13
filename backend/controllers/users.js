// controllers/users.js
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { emitNotification } = require('../NotificationWebSocket.js');

//added this to avoid recreating database connection from scratch
//need to test if it still works properly
const db = require("../config/database");

//create is same as register in register views. might have to modify that code to use this one
// Create a new user
exports.create = async (req, res) => {

    console.log('Request body:', req.body);
    
    const { name, role, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        // Insert user into the database
        db.query('INSERT INTO users SET ?', { name, role, email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log('Error inserting user:', error);
                return res.status(500).send('Error creating user');
            }

            const userId = results.insertId; // Get the ID of the newly inserted user
            console.log('New User Added: Name:', name, 'Email:', email);

            // Determine the subtype table and insert the user ID
            let insertQuery;

            switch (role) {
                case 'student':
                    insertQuery = 'INSERT INTO student SET ?';
                    break;
                case 'lecturer':
                    insertQuery = 'INSERT INTO lecturer SET ?';
                    break;
                case 'admin':
                    insertQuery = 'INSERT INTO admin SET ?';
                    break;
                default:
                    return res.status(400).send('Invalid role');
            }

            if (insertQuery) {
                db.query(insertQuery, { user_id: userId }, (err) => {
                    if (err) {
                        console.log('Error inserting into subtype table:', err);
                        return res.status(500).send('Error creating user subtype');
                    }
                    emitNotification('user_created', { id: userId, name, email });
                    // Send success response
                    res.status(201).json({
                        message: 'User created successfully',
                        user: {
                            name,
                            email
                        }
                    });
                });
            } else {
                res.status(400).send('Invalid role');
            }
        });
    } catch (error) {
        console.log('Hashing error:', error);
        res.status(500).send('Error hashing password');
    }
};


/* CODE is a more efficient version, will use it when its time for frontend with react
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt comparison error:', err);
                return res.status(500).send('Server error');
            }
            if (isMatch) {
                const token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.json({
                    message: 'Login successful',
                    token,
                    role: user.role
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
};
*/

//code used for logging in
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Query to find the user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt comparison error:', err);
                return res.status(500).send('Server error');
            }
            if (isMatch) {
                // Generate JWT with user_id included in the payload
                const token = jwt.sign(
                    { id: user.user_id, email: user.email, role: user.role }, // Use user.user_id here
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                // Log the token to the console
                console.log('Generated JWT:', token);

                // Send token and user_id as part of the response
                const response = {
                    message: 'Login successful',
                    token: token,
                    userId: user.user_id, // Add userId to the response
                    role: user.role
                };

                // Emit notification for successful login
                emitNotification('user_logged_in', { email: user.email, role: user.role });

                // Return the response
                res.json(response);
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
};


// Read all users
exports.read = (req, res) => {
    const userId = req.params.id;

    // If an ID is provided, fetch a single user
    if (userId) {
        db.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error fetching user');
            }
            if (results.length === 0) {
                return res.status(404).send('User not found');
            }
            res.json(results[0]); // Return the first user found
        });
    } else {
        // If no ID is provided, fetch all users
        db.query('SELECT * FROM users', (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error fetching users');
            }
            res.json(results);
        });
    }
};

// Update a user
exports.update = (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' }); // Ensure user ID is provided
    }

    // Initialize the query parts
    let query = 'UPDATE users SET ';
    let values = [];
    
    // Dynamically build the query based on provided fields
    if (name) {
        query += 'name = ?, ';
        values.push(name);
    }
    if (email) {
        query += 'email = ?, ';
        values.push(email);
    }
    if (password) {
        query += 'password = ?, '; // Add placeholder for password
    }
    
    // Remove the last comma and space, and add the WHERE clause
    query = query.slice(0, -2) + ' WHERE user_id = ?';
    values.push(id);

    // If password is being updated, hash it
    if (password) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(`Error hashing password for user ${id}: ${err}`);
                return res.status(500).json({ message: 'Server error' });
            }
            values.splice(values.length - 1, 0, hashedPassword); // Insert hashed password before the ID
            db.query(query, values, (error, results) => {
                if (error) {
                    console.error(`Error updating user ${id}: ${error}`);
                    return res.status(500).json({ message: 'Error updating user' });
                }
                console.log(`User ${id} updated successfully`);
                // Notify clients of user update
                emitNotification('user_updated', { id, name, email });

                // Return a JSON response
                res.status(200).json({ message: 'User updated successfully' });
            });
        });
    } else {
        db.query(query, values, (error, results) => {
            if (error) {
                console.error(`Error updating user ${id}: ${error}`);
                return res.status(500).json({ message: 'Error updating user' });
            }
            console.log(`User ${id} updated successfully`);
            // Notify clients of user update
            emitNotification('user_updated', { id, name, email });

            // Return a JSON response
            res.status(200).json({ message: 'User updated successfully' });
        });
    }
};




// Delete a user
exports.delete = (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).send('User ID is required'); // Ensure user ID is provided
    }

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) throw err;

        // First, delete the related records in the student table
        db.query('DELETE FROM student WHERE user_id = ?', [id], (error) => {
            if (error) {
                return db.rollback(() => {
                    console.error(`Error deleting student records for user ${id}:`, error);
                    return res.status(500).send('Error deleting user');
                });
            }

            // Now delete the user from the users table
            db.query('DELETE FROM users WHERE user_id = ?', [id], (error, results) => {
                if (error) {
                    return db.rollback(() => {
                        console.error(`Error deleting user ${id}:`, error);
                        return res.status(500).send('Error deleting user');
                    });
                }

                // Commit the transaction
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error(`Error committing transaction for user ${id}:`, err);
                            return res.status(500).send('Error deleting user');
                        });
                    }

                    // Notify clients of user deletion
                    emitNotification('user_deleted', { id });

                    res.send('User deleted successfully');
                });
            });
        });
    });
};