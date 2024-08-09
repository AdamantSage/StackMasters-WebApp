// middleware/roleMiddleware.js
//to check user roles
function checkRole(roles) {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).send('Access denied');
        }
    };
}

module.exports = checkRole;
