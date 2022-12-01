const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  handleCreateGroup,
  getAllGroups,
} = require("../controllers/groupController");

router.post("/creategroup", handleCreateGroup);
router.get("/getgroups", getAllGroups);

module.exports = router;
