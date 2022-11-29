const express = require("express");
const router = express.Router();
const validateLoginForm = require("../controllers/validateLoginForm");
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSign, jwtVerify, getJwt } = require("../controllers/jwt/jwtAuth");
const {
  handleLogin,
  attemptLogin,
  attemptRegister,
} = require("../controllers/authController");
require("dotenv").config();

router.route("/login").get(handleLogin).post(validateLoginForm, attemptLogin);

router.post("/signup", validateLoginForm, attemptRegister);

module.exports = router;
