const Users = require("../models/User.js");
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { username, email, password, confirmpassword } = req.body;
  
  if (!username || !email || !password || !confirmpassword) {
    return res.json({ error: "All fields are required" });
  }

  function isValid(username) { return /^\w+$/.test(username); }
  
  try {
    const userExist = await Users.findOne({ email });
    const usernameExist = await Users.findOne({ username });

    if (userExist) return res.json({ error: "User Already Exist" });
    if (!isValid(username)) return res.json({ error: "Invalid Username (use only alphanumeric and underscores)" });
    if (usernameExist) return res.json({ error: "Username Already Exists" });
    if (!email.includes("@") || !email.includes(".")) return res.json({ error: "Invalid Email" });
    if (password !== confirmpassword) return res.json({ error: "Passwords Did Not Match" });

    const newUser = new Users({ username, email, password });
    await newUser.save();
    res.json({ message: "Registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: "Provide email and password" });
  }

  try {
    const validUser = await Users.findOne({ email });
    if (validUser) {
      const validPassword = await bcrypt.compare(password, validUser.password);
      if (!validPassword) {
        return res.json({ error: "Invalid Password" });
      } else {
        const token = await validUser.generateAuthToken();
        res.cookie("JWTFINALTOKEN", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });
        const result = { validUser, token };
        res.status(201).json({ status: 201, result });
      }
    } else {
      res.json({ error: "Invalid User" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.getValidUser = async (req, res) => {
  try {
    let userValid = await Users.findOne({ _id: req.userId });
    if (userValid) {
      res.status(201).json({ status: 201, userValid });
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: 401, message: "Unauthorized" });
  }
};

exports.logout = async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((e) => e.token != req.token);
    res.clearCookie("JWTFINALTOKEN", { path: '/' });
    await req.rootUser.save();
    res.status(201).json({ status: 201 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout failed" });
  }
};
