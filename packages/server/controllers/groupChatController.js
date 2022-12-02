const pool = require("../db");

module.exports.addMessage = async (req, res) => {
  console.log("add message activated from back");

  const newMessageQuery = await pool.query(
    "INSERT INTO messages(sender_id, group_id, text) values ($1, $2, $3)",
    [req.body.userId, req.body.currentGroup, req.body.mymessage]
  );

  res.json({
    ...req.body,
    status: "Message successfully sent",
  });
};

// I still need to edit this a bit
module.exports.getMessages = async (req, res) => {
  const getMessagesQuery = await pool.query(
    "SELECT username sender_username, text, messages.id messages_id, messages.created_at sent_at FROM messages INNER JOIN users ON messages.sender_id = users.id WHERE messages.group_id = $1 ORDER BY messages.created_at ASC",
    [req.body.currentGroup]
  );
  console.log(getMessagesQuery.rows);
  res.send(getMessagesQuery.rows); // if this is null, check for that in the front end
  //& tell the user they don't belong to any groups.
};
