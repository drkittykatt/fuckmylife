const pool = require("../db");
const bcrypt = require("bcrypt");

module.exports.handleDeleteAccount = async (req, res) => {
  const existingUser = await pool.query(
    "SELECT username, passhash from users WHERE username=$1",
    [req.body.username]
  );
  console.log(existingUser);
  if (existingUser.rowCount != 0) {
    // account exists and can be deleted
    const isSamePass = await bcrypt.compare(
      req.body.password,
      existingUser.rows[0].passhash
    );
    console.log(isSamePass);

    if (isSamePass) {
      const deleteUserQuery = await pool.query(
        "DELETE FROM users WHERE username=$1",
        [req.body.username]
      );
      res.json({ loggedIn: false, status: "User successfully deleted" });
    } else {
      res.json({ status: "Wrong password!" });
      console.log("wrong password");
    }
  } else {
    res.json({ loggedIn: false, status: "User does not exist" });
  }
};

module.exports.handleUpdateUsername = async (req, res) => {
  const existingUser = await pool.query(
    "SELECT username, passhash from users WHERE username=$1",
    [req.body.username]
  );
  const isSamePass = await bcrypt.compare(
    req.body.passattempt,
    existingUser.rows[0].passhash
  );
  if (isSamePass) {
    // password is correct, now check and see if the desired new username is taken
    const usernameTaken = await pool.query(
      "SELECT username from users WHERE username=$1",
      [req.body.newusername]
    );
    if (usernameTaken.rowCount === 0) {
      //username is not taken & can be used

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
      res.json({
        username: req.body.username,
        status: "Username is already taken!",
      });
      console.log("username not available");
    }
  } else {
    res.json({ username: req.body.username, status: "Wrong password!" });
    console.log("wrong password");
  }
};
