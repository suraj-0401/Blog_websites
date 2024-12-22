import jwt from 'jsonwebtoken';
import { User } from '../models/model.user.js'; // Ensure this model is properly implemented

// Middleware to check if the user is authenticated
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "User not authenticated, please log in." });
    }

    // Extract token from the authorization header
    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing, please log in." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Token:", decoded);

    // Attach the user to the request object
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found, please log in." });
    }

    req.user = user; // Populate req.user for subsequent middlewares
    next();
  } catch (error) {
    console.error("Error in Authentication:", error);

    // Return specific errors based on JWT verification error types
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token, please log in again." });
    }

    // Generic error
    return res.status(401).json({ message: "Authentication failed, please try again." });
  }
};

// Middleware to check if the user has the correct role(s)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user.role}) is not authorized to access this resource.`,
      });
    }
    next();
  };
};
