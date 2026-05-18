const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "qwertyuiopasdfghjklzxcvbnmqwerty";
const Users = require("../models/User.js");

const authentication = async (req, res, next) => {
  try {
    // Support token from Authorization header (plain token or Bearer) or from cookie
    const authHeader = req.headers.authorization || req.cookies?.JWTFINALTOKEN;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const verifyToken = jwt.verify(token, secretKey);
    const rootUser = await Users.findOne({ _id: verifyToken._id });
    if (!rootUser) {
      return res.status(404).json({ error: "user not found" });
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    console.error("Auth Error:", error.message);
  }
};

module.exports = authentication;
