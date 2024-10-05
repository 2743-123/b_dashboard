const jwt = require('jsonwebtoken');


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Middleware to check for superadmin
const requireSuperadmin = (req, res, next) => {
  if (req.userRole !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied: Superadmin only' });
  }
  next();
};

module.exports = { verifyToken, requireSuperadmin };
