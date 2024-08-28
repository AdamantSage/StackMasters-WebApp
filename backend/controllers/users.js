// controllers/users.js
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

//added this to avoid recreating database connection from scratch
//need to test if it still works properly
const db = require("../config/database");

//create is same as register in register views. might have to modify that code to use this one
// Create a new user
exports.create = async (req, res) => {
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

    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt comparison error:',err);
                return res.status(500).send('Server error');
            }
            if (isMatch) {
                const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                
                // Log the token to the console
                console.log('Generated JWT:', token);

                // Send token as part of the response
                if (user.role === 'admin') {
                    res.json({
                        message: 'Login successful',
                        token: token,
                        role: user.role // Optional: You can also send the user's role
                    });
                } else if (user.role === 'lecturer') {
                    res.json({
                        message: 'Login successful',
                        token: token,
                        role: user.role
                    });
                } else if (user.role === 'student') {
                    res.json({
                        message: 'Login successful',
                        token: token,
                        role: user.role
                    });
                } else {
                    res.status(403).send('Access denied');
                }
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
};


// Read all users
exports.read = (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error fetching users');
        }
        res.json(results);
    });
};

// Update a user
// Update a user
// Update a user
exports.update = (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;

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
        query += 'password = ?, ';
    }
    
    // Remove the last comma and space, and add the WHERE clause
    query = query.slice(0, -2) + ' WHERE id = ?';
    values.push(id);

    // If password is being updated, hash it
    if (password) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(`Error hashing password for user ${id}: ${err}`);
                return res.status(500).send('Server error');
            }
            values.splice(values.length - 1, 0, hashedPassword); // Insert hashed password before the ID
            db.query(query, values, (error, results) => {
                if (error) {
                    console.error(`Error updating user ${id}: ${error}`);
                    return res.status(500).send('Error updating user');
                }
                console.log(`User ${id} updated successfully`);
                res.send('User updated successfully');
            });
        });
    } else {
        db.query(query, values, (error, results) => {
            if (error) {
                console.error(`Error updating user ${id}: ${error}`);
                return res.status(500).send('Error updating user');
            }
            console.log(`User ${id} updated successfully`);
            res.send('User updated successfully');
        });
    }
};



// Delete a user
exports.delete = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error deleting user');
        }
        res.send('User deleted successfully');
    });
};
