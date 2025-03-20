const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            console.log('Invalid token: User not found');
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Attach user and role to the request object
        req.user = { id: user.id, role: decoded.role };
        console.log('Authenticated user:', req.user);
        next();
    } catch (error) {
        console.error('Error in authMiddleware:', error.message);
        res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        console.log('User role:', req.user.role);
        const userRole = req.user.role.toLowerCase(); // Normalize to lowercase
        const allowedRoles = roles.map(role => role.toLowerCase()); // Normalize roles to lowercase

        if (!allowedRoles.includes(userRole)) {
            console.log('Access denied: User does not have the required role');
            return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
        }

        console.log('Access granted: User has the required role');
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
