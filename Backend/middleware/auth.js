const jwt = require('jsonwebtoken');

// Ye middleware check karta hai ki request ke saath valid token hai ya nahi
// Isse protected routes banate hain, jaise "/api/profile"
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Login karo pehle' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid ya expire ho gaya, dubara login karo' });
  }
};

module.exports = protect;