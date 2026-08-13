const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if request has a valid token
// Used for protected routes like "/api/profile"
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please login first' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    
    // Fetch user details for controllers that need them
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.userName = user.name;
      req.userEmail = user.email;
      req.userRole = user.role || 'user';
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token, please login again' });
  }
};

module.exports = protect;