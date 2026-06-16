const { API_KEY } = require('../config/auth');

// Protect routes - API key authentication required
const protect = (req, res, next) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Missing API key',
      message: 'X-API-Key header is required'
    });
  }

  if (apiKey !== API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
      message: 'The provided API key is incorrect'
    });
  }

  next();
};

// For future use with role-based access control
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // This would be used with user authentication in a real app
    // For now, all authenticated API key users have full access
    next();
  };
};

// Optional authentication - route can work with or without API key
const optionalAuth = (req, res, next) => {
  const apiKey = req.header('X-API-Key');

  if (apiKey && apiKey === API_KEY) {
    req.isAuthenticated = true;
  } else {
    req.isAuthenticated = false;
  }

  next();
};

module.exports = {
  protect,
  restrictTo,
  optionalAuth
};
