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
} = require("../controllers/groupController");

router.post("/creategroup", handleCreateGroup);
router.get("/getgroups", getAllGroups);
router.post("/mygroups", getMyGroups);
router.post("/joingroup", handleJoinGroup);

module.exports = router;
