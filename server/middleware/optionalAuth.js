const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const DEFAULT_USER_ID = 1;

// Sets req.userId from token if valid, otherwise uses DEFAULT_USER_ID
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      req.user = decoded;
    } catch {
      req.userId = DEFAULT_USER_ID;
    }
  } else {
    req.userId = DEFAULT_USER_ID;
  }
  next();
};

module.exports = optionalAuth;
