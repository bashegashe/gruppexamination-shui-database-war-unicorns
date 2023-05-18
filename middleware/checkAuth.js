import jwt from 'jsonwebtoken';

function checkAuth(req, res, next) {
  const token = req.cookies.token || null;

  if (!token) {
    const error = new Error('Not authenticated!');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a1b1c1');

    req.userId = decoded.userId;
    next();
  } catch (err) {
    const error = new Error('Not authenticated!');
    error.statusCode = 401;
    throw error;
  }
}

export default checkAuth;
