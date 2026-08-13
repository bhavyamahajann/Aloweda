// Admin middleware to check if user has admin privileges
const admin = (req, res, next) => {
  // Check if user is admin
  // This can be based on a role field in the user document
  // For now, we'll use a simple check
  
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - No user ID found'
    });
  }
  
  // Check if user has admin role
  // You should add a 'role' field to your User model
  // For now, we'll check if user email matches admin email from env
  const adminEmails = process.env.ADMIN_EMAILS ? 
    process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) : 
    [];
  
  // Alternative: Check from user role in database
  if (req.userRole === 'admin' || adminEmails.includes(req.userEmail)) {
    req.isAdmin = true;
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied - Admin privileges required'
    });
  }
};

module.exports = admin;
