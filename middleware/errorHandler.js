/* eslint-disable no-unused-vars */
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(err.statusCode || 500).json({ success: false, error: err.message });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({ success: false, message: 'Route not found!' });
}

export { logErrors, errorHandler, notFoundHandler };
