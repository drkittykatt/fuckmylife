const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  handleCreateGroup,
  getAllGroups,
  handleJoinGroup,
  getMyGroups,
  handleCreatePost,
  handleGetPosts,
} = require("../controllers/groupController");

router.post("/creategroup", handleCreateGroup);
router.get("/getgroups", getAllGroups);
router.post("/mygroups", getMyGroups);
router.post("/joingroup", handleJoinGroup);
router.post("/:group_id/createpost", handleCreatePost);
router.post("/:group_id/posts", handleGetPosts);

module.exports = router;
