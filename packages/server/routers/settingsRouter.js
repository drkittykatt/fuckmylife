const express = require("express");
const router = express.Router();
const validateChangeUsernameForm = require("../controllers/validateChangeUsernameForm");
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSign, jwtVerify, getJwt } = require("../controllers/jwt/jwtAuth");
const {
  handleDeleteAccount,
  handleUpdateUsername,
} = require("../controllers/settingsController");
require("dotenv").config();

router.post("/delete", handleDeleteAccount);
router.post(
  "/updateusername",
  validateChangeUsernameForm,
  handleUpdateUsername
);

module.exports = router;
