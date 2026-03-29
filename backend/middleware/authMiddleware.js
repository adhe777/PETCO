const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.split(' ')[1]; // Format: Bearer <token>

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // The payload contains { id, role }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Support 'admin' or 'Administrator' equivalently if 'admin' is checked
        let userRole = req.user?.role;
        if (roles.includes('admin') && userRole === 'Administrator') {
            userRole = 'admin';
        }
        if (!req.user || !roles.includes(userRole)) {
            return res.status(403).json({ message: `Role: ${req.user?.role || 'none'} is not authorized to access this resource` });
        }
        next();
    };
};

module.exports = { auth, authorizeRoles };
