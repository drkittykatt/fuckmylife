const pool = require("../db");
const bcrypt = require("bcrypt");

module.exports.handleCreateGroup = async (req, res) => {
  console.log("req.body is equal to: " + req.body);
  const newGroupQuery = await pool.query(
    "INSERT INTO groups(name, description) values($1,$2) RETURNING id",
    [req.body.groupname, req.body.description]
  );

  const groupId = newGroupQuery.rows[0].id;
  console.log("new group id: " + groupId);

  // when someone creates a group, they are added as the admin of the group & participating by default
  const newParticipantQuery = await pool.query(
    "INSERT INTO participants(user_id, group_id, is_admin) values ($1, $2, true) RETURNING id, user_id, group_id",
    [req.body.userId, groupId]
  );

  console.log("new participant id: " + newParticipantQuery.rows[0].id);

  res.json({
    ...req.body,
    status: "Group successfully created & you are the admin of this group",
  });
};

module.exports.getAllGroups = async (req, res) => {
  const allGroupsQuery = await pool.query(
    "SELECT name, description, id FROM groups"
  );
  //   const result = {
  //     // allGroups: allGroupsQuery.rows,
  //   };
  console.log(allGroupsQuery.rows);
  //   res.send(result);
  res.send(allGroupsQuery.rows);
};
