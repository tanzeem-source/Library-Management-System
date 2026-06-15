class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // 1. Set defaults first
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const statusCode = 400;
    const message = "Duplicate field value entered";
    err = new ErrorHandler(message, statusCode);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const statusCode = 400;
    const message = "Json web token is invalid, Try again";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "TokenExpiredError") {
    const statusCode = 400;
    const message = "Json web token is expired, Try again";
    err = new ErrorHandler(message, statusCode);
  }

  // Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    const statusCode = 400;
    // Fixed the typo here: changed $(err.path) to ${err.path}
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, statusCode);
  }

  // Handle Mongoose validation errors
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
