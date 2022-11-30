const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleCreateGroup } = require("../controllers/groupController");

router.post("/creategroup", handleCreateGroup);

module.exports = router;
