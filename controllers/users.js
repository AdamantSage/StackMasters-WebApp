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

//code used to login user
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
                
                // Assuming req.user is populated by your authentication middleware
                req.user = { id: user.id, role: user.role };

                if (user.role === 'admin') {
                    res.render('dashboard');
                } else if (user.role === 'lecturer') {
                    res.render('index');
                } else if (user.role === 'student') {
                    res.render('index');
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
