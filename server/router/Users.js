const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/getuser", userController.getAllUsers);
router.get("/userById/:id", userController.getUserById);
router.patch("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);

router.patch("/:id/follow", userController.followUser);
router.patch("/:id/unfollow", userController.unfollowUser);
router.get("/:id/followers", userController.getFollowers);
router.get("/:id/followings", userController.getFollowings);

router.get("/userscount", userController.getUsersCount);
router.get("/search/author?", userController.searchAuthors);

module.exports = router;
