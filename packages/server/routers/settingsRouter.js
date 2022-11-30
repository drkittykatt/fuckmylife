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
  handleUpdatePassword,
  handleForgotPassword,
  handleGeneratePasscode,
} = require("../controllers/settingsController");
const validateChangePasswordForm = require("../controllers/validateChangePasswordForm");
require("dotenv").config();

router.post("/delete", handleDeleteAccount);
router.post(
  "/updateusername",
  validateChangeUsernameForm,
  handleUpdateUsername
);
router.post(
  "/updatepassword",
  validateChangePasswordForm,
  handleUpdatePassword
);
router.post("/generatepasscode", handleGeneratePasscode);

// add validation
router.post(
  "/forgotpassword",
  // validateForgotPasswordForm,
  handleForgotPassword
);

module.exports = router;
