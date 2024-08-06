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
    const { name, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword }, (error, results) => {
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

//code used to login user
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Fetch user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        // Compare provided password with hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server error');
            }
            if (isMatch) {
                // Generate a JWT token
                const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({
                    message: 'Login successful',
                    token: token
                });
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
exports.update = (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;
    db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error updating user');
        }
        res.send('User updated successfully');
    });
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
