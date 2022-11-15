const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSign, jwtVerify, getJwt } = require("../controllers/jwt/jwtAuth");
require("dotenv").config();

router
  .route("/login")
  .get(async (req, res) => {
    const token = getJwt(req);

    if (!token) {
      res.json({ loggedIn: false });
      return;
    }

    jwtVerify(token, process.env.JWT_SECRET)
      .then(async (decoded) => {
        const potentialUser = await pool.query(
          "SELECT username FROM users u WHERE u.username = $1",
          [decoded.username]
        );

        if (potentialUser.rowCount === 0) {
          res.json({ loggedIn: false, token: null });
          return;
        }

        res.json({ loggedIn: true, token });
      })
      .catch(() => {
        res.json({ loggedIn: false });
      });
  })
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
        jwtSign(
          {
            username: req.body.username,
            id: potentialLogin.rows[0].id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "365d" } //can change to "1min" to test logic when token expires
          // (err, token) => {
          //   if (err) {
          //     res.json({
          //       loggedIn: false,
          //       status: "Something went wrong, try again later",
          //     });
          //     return;
          //   }
          //   res.json({ loggedIn: true, token });
          //   console.log("logged in");
          // }
        )
          .then((token) => {
            res.json({ loggedIn: true, token });
            console.log("logged in");
          })
          .catch((err) => {
            console.log(err);
            res.json({
              loggedIn: false,
              status: "Something went wrong, try again later",
            });
          });
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password!" });
        console.log("wrong password");
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
    jwtSign(
      {
        username: req.body.username,
        id: newUserQuery.rows[0].id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    )
      .then((token) => {
        res.json({ loggedIn: true, token });
        console.log("new user registered");
      })
      .catch((err) => {
        console.log(err);
        res.json({
          loggedIn: false,
          status: "Something went wrong, try again later",
        });
      });
  } else {
    res.json({ loggedIn: false, status: "Username taken" });
  }
});

module.exports = router;
