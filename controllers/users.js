// controllers/users.js
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//create is same as register in register views. might have to modify that code to use this one
// Create a new user
exports.create = async (req, res) => {
    const { name,role,email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        db.query('INSERT INTO users SET ?', { name,role,email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error creating user');
            }
            res.send('User created successfully');
        });
    } catch (error) {
        console.log('Hashing error:', error);
        res.status(500).send('Error hashing password');
    }
};

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
                console.log(err);
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

    // If password is being updated, hash it
    let query = 'UPDATE users SET name = ?, email = ?' + (password ? ', password = ?' : '') + ' WHERE id = ?';
    let values = [name, email];
    
    if (password) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(`Error hashing password for user ${id}: ${err}`);
                return res.status(500).send('Server error');
            }
            values.push(hashedPassword);
            values.push(id);

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
        values.push(id);
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
