// middleware/adminMiddleware.js

function adminOnly(req, res, next) {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({
      message: 'Admin access required',
    });
  }

  next();
}

module.exports = { adminOnly };