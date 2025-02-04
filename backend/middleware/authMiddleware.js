const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



// Middleware to check authentication
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified; // Store user info in request object
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// Middleware for Role-Based Access Control (RBAC)
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
