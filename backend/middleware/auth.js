const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user; // Attach user to request object
        next();
    });
}
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    // Verify token and extract user info
    // Set req.user to the user object from the token
    req.user = { id: userIdFromToken }; // Set this properly
    next();
};

module.exports = authenticateToken, authMiddleware;
