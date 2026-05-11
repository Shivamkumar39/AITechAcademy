const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authentication = require("../middleware/Auth.js");

router.post('/register', authController.register);
router.post("/login", authController.login);
router.get("/validuser", authentication, authController.getValidUser);
router.get("/logout", authentication, authController.logout);

module.exports = router;