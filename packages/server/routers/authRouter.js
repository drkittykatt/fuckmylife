const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
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

router.route("/login").get(handleLogin).post(validateForm, attemptLogin);

router.post("/signup", validateForm, attemptRegister);

module.exports = router;
