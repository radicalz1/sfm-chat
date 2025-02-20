const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Expect the token in the header as "Bearer <token>"
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded; // contains { id, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
