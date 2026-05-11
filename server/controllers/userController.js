const Users = require("../models/User.js");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: "deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.followUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (userId === id) {
    return res.status(400).send("You cannot follow yourself");
  }
  try {
    const userToFollow = await Users.findById(id);
    const currentUser = await Users.findById(userId);
    if (!userToFollow || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!userToFollow.followers.includes(userId)) {
      await userToFollow.updateOne({ $push: { followers: userId } });
      await currentUser.updateOne({ $push: { followings: id } });
      res.json({ message: "Success" });
    } else {
      res.json({ message: "You already follow this user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to follow user" });
  }
};

exports.unfollowUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (userId === id) {
    return res.status(400).send("You cannot unfollow yourself");
  }
  try {
    const userToUnfollow = await Users.findById(id);
    const currentUser = await Users.findById(userId);
    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (userToUnfollow.followers.includes(userId)) {
      await userToUnfollow.updateOne({ $pull: { followers: userId } });
      await currentUser.updateOne({ $pull: { followings: id } });
      res.json({ message: "Success" });
    } else {
      res.json({ message: "You don't follow this user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
};

exports.getFollowers = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: "Invalid User ID" });
    res.json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch followers" });
  }
};

exports.getFollowings = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: "Invalid User ID" });
    res.json({ followings: user.followings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch followings" });
  }
};

exports.getUsersCount = async (req, res) => {
  try {
    const count = await Users.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users count" });
  }
};

exports.searchAuthors = async (req, res) => {
  const { q } = req.query;
  try {
    const users = await Users.find({ username: { $regex: q || "", $options: "i" } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
};
