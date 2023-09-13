// error handling
const errorHandler = (err, req, res, next) => {
  // status code
  const statusCode = res.statusCode ? res.statusCode : 500;
  // error message
  const message = err.message ? err.message : "unknown Error";
  // error response
  res.status(statusCode).json({
    message: message,
    status: statusCode,
    stack: err.stack,
  });
};

// export error handlers
export default errorHandler;
