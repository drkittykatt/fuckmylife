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
  console.log(allGroupsQuery.rows);
  res.send(allGroupsQuery.rows);
};

// I still need to edit all this. It's just copied from getAllGroups.
module.exports.getMyGroups = async (req, res) => {
  const myGroupsQuery = await pool.query(
    "SELECT groups.id group_id, groups.name, groups.description, participants.user_id user_id FROM groups INNER JOIN participants ON groups.id = participants.group_id WHERE participants.user_id = $1;",
    [req.body.userId]
  );
  console.log(myGroupsQuery.rows);
  res.send(myGroupsQuery.rows); // if this is null, check for that in the front end
  //& tell the user they don't belong to any groups.
};

module.exports.handleJoinGroup = async (req, res) => {
  console.log("handle join group triggered");
  console.log(
    "userId: " + req.body.userId + ", joinGroupId: " + req.body.joinGroupId
  );
  const existingParticipant = await pool.query(
    "SELECT user_id, group_id FROM participants WHERE user_id=$1 AND group_id=$2",
    [req.body.userId, req.body.joinGroupId]
  );

  if (existingParticipant.rowCount === 0) {
    //user isn't already participating & can be added
    const joinGroupQuery = await pool.query(
      "INSERT INTO participants(user_id, group_id, is_admin) values ($1, $2, false) RETURNING id, user_id, group_id",
      [req.body.userId, req.body.joinGroupId]
    );
    res.json({
      ...req.body,
      status: "Successfully added 😘",
    });
    // now check to see if the user is already a participant or not. If not, add them to the group.
  } else {
    res.json({
      ...req.body,
      status:
        "you're already in this group lmao. You can't join twice, you fool!",
    });
  }
};
