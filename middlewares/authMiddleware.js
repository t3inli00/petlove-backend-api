const express = require('express');
const jwt = require('jsonwebtoken');

// Define jwtMiddleware as a function that returns another function
const AuthMiddleware = ((req, res, next) => {
  // Get secret key
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY || "teampetlove.com";

    // Get the bearer token from the request headers
    const authHeader = req.headers.authorization || "";
    const accessToken = authHeader.split(' ')[1];

    // Check for access token, empty or not
    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized access. Invalid or missing token.' });
    }

    try {
      // Verify token using the provided secret key
      const decodedToken = jwt.verify(accessToken, secretKey);

      if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
        return res.status(401).json({ error: 'Unauthorized access. Token has expired.' });
      }

      // Move to the next middleware or route handler
      next();
    } catch (error) {
      // *Handle token verification errors
      return res.status(401).json({ error: error.message === "jwt expired" ? "JWT token expired" : "Unauthorized access. Invalid or missing token." });
    }
  });

module.exports = { AuthMiddleware };
