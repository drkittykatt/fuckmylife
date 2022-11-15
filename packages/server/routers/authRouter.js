const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// router.post("/login", (req, res) => {
//   validateForm(req, res);
// });

router
  .route("/login")
  //   .get(async (req, res) => {
  //     if (req.session.user && req.session.user.username) {
  //       res.json({ loggedIn: true, username: req.session.user.username });
  //     } else {
  //       res.json({ loggedIn: false });
  //     }
  //   })
  .post(async (req, res) => {
    validateForm(req, res);

    const potentialLogin = await pool.query(
      "SELECT id, username, passhash FROM users u WHERE u.username=$1",
      [req.body.username]
    );

    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].passhash
      );
      if (isSamePass) {
        jwt.sign(
          {
            username: req.body.username,
            id: potentialLogin.rows[0].id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "365d" }, //can change to "1min" to test logic when token expires
          (err, token) => {
            if (err) {
              res.json({
                loggedIn: false,
                status: "Something went wrong, try again later",
              });
              return;
            }
            res.json({ loggedIn: true, token });
          }
        );
        res.json({ loggedIn: true, username: req.body.username });
        console.log("logged in");
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password!" });
        console.log("not good");
      }
    } else {
      console.log("not good");
      res.json({ loggedIn: false, status: "Wrong username or password!" });
    }
  });

router.post("/signup", async (req, res) => {
  validateForm(req, res);

  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    // register
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passhash) values($1,$2) RETURNING id, username",
      [req.body.username, hashedPass]
    );
    // req.session.user = {
    //   username: req.body.username,
    //   id: newUserQuery.rows[0].id,
    // };

    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: "Username taken" });
  }
});

module.exports = router;
