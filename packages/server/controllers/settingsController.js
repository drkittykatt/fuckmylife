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
      req.body.passattempt,
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
      res.json({ username: req.body.username, status: "Wrong password!" });
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

module.exports.handleUpdatePassword = async (req, res) => {
  const existingUser = await pool.query(
    "SELECT username, passhash from users WHERE username=$1",
    [req.body.username]
  );
  const isSamePass = await bcrypt.compare(
    req.body.password,
    existingUser.rows[0].passhash
  );
  if (isSamePass) {
    const hashedPass = await bcrypt.hash(req.body.passattempt1, 10);
    const updatePasswordQuery = await pool.query(
      "UPDATE users SET passhash=$1 WHERE username=$2",
      [hashedPass, existingUser.rows[0].username]
    );

    res.json({
      loggedIn: true,
      username: req.body.username,
      status: "password successfully updated",
    });
  } else {
    res.json({ username: req.body.username, status: "Wrong password!" });
    console.log("wrong password");
  }
};

module.exports.handleGeneratePasscode = async (req, res) => {
  // this all still needs to be tested
  console.log(req.body.mypasscode);
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (req.body.mypasscode != null) {
    // need to send an email to the user
    // may need to check and make sure the email got sent successfully before sendign the success status.
    // res.json({
    //   ...user,
    //   loggedIn: true,
    //   status:
    //     "email with passcode successfully sent. Please check your email & you may need to check the spam folders if you don't see the email.",
    // });
    res.json({ ...req.body, status: "passcode saved in back end" });
  } else {
    res.json({
      ...req.body,
      status:
        "You need to generate a passcode. We don't have one on file for you yet.",
    });
    console.log("no passcode");
  }
};

module.exports.handleForgotPassword = async (req, res) => {
  console.log(req.body.passcode);
  console.log(req.body.mypasscode);
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (req.body.passcode == req.body.mypasscode) {
    // const hashedPass = await bcrypt.hash(req.body.passattempt1, 10);
    // const updatePasswordQuery = await pool.query(
    //   "UPDATE users SET passhash=$1 WHERE username=$2",
    //   [hashedPass, existingUser.rows[0].username]
    // );

    res.json({
      ...req.body,
      status: "password successfully updated",
    });
  } else {
    res.json({ ...req.body, status: "Passcode is incorrect" });
    console.log("wrong passcode");
  }
};
