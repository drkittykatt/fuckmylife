const pool = require("../db");
const bcrypt = require("bcrypt");
const { jwtSign, jwtVerify, getJwt } = require("./jwt/jwtAuth");

// will probably want to make the user enter their password again before they can delete
module.exports.handleDeleteAccount = async (req, res) => {
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount != 0) {
    // account exists and can be deleted
    const deleteUserQuery = await pool.query(
      "DELETE FROM users WHERE username=$1",
      [req.body.username]
    );
    res.json({ loggedIn: false, status: "User successfully deleted" });
  } else {
    res.json({ loggedIn: false, status: "User does not exist" });
  }
};

// will probably want to make the user enter their password again before they can update username
// also need to make sure username isn't already taken before changing it!!!
module.exports.handleUpdateUsername = async (req, res) => {
  console.log(req.body.username, req.body.newusername);
  console.log(req.body);
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount != 0) {
    // account exists and can be updated
    console.log("trying from back end");
    const updateUsernameQuery = await pool.query(
      "UPDATE users SET username=$2 WHERE username=$1",
      [req.body.username, req.body.newusername]
    );
    res.json({
      loggedIn: true,
      username: req.body.newusername,
      status: "Username successfully updated",
    });
  } else {
    res.json({ loggedIn: false, status: "User does not exist" });
  }
};
