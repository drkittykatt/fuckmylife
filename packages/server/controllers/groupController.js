const pool = require("../db");

module.exports.handleCreateGroup = async (req, res) => {
  const newGroupQuery = await pool.query(
    "INSERT INTO groups(name, description) values($1,$2) RETURNING id",
    [req.body.groupname, req.body.description]
  );

  const groupId = newGroupQuery.rows[0].id;

  // when someone creates a group, they are added as the admin of the group & participating by default
  const newParticipantQuery = await pool.query(
    "INSERT INTO participants(user_id, group_id, is_admin) values ($1, $2, true) RETURNING id, user_id, group_id",
    [req.body.userId, groupId]
  );

  res.json({
    ...req.body,
    status: "Group successfully created & you are the admin of this group",
  });
};

module.exports.getAllGroups = async (req, res) => {
  const allGroupsQuery = await pool.query(
    "SELECT name, description, id FROM groups"
  );
  res.send(allGroupsQuery.rows);
};

// I still need to edit this a bit
module.exports.getMyGroups = async (req, res) => {
  const myGroupsQuery = await pool.query(
    "SELECT groups.id group_id, groups.name, groups.description, participants.user_id user_id FROM groups INNER JOIN participants ON groups.id = participants.group_id WHERE participants.user_id = $1;",
    [req.body.userId]
  );
  res.send(myGroupsQuery.rows); // if this is null, check for that in the front end
  //& tell the user they don't belong to any groups.
};

module.exports.handleJoinGroup = async (req, res) => {
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

module.exports.handleCreatePost = async (req, res) => {
  const newPostQuery = await pool.query(
    "INSERT INTO posts(title, body_text, sender_id, group_id) values($1,$2,$3,$4) RETURNING id",
    [req.body.title, req.body.body_text, req.body.userId, req.params.group_id]
  );

  res.json({
    ...req.body,
    status: "Post successfully created",
  });
};

module.exports.handleGetPosts = async (req, res) => {
  const getPostsQuery = await pool.query(
    "SELECT id post_id, sender_id, title, body_text FROM posts WHERE group_id = $1 ORDER BY created_at ASC;",
    [req.params.group_id]
  );
  res.send(getPostsQuery.rows); // if this is null, check for that & display a message saying no posts
};
