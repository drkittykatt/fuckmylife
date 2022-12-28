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

module.exports.handleCreateComment = async (req, res) => {
  const newPostQuery = await pool.query(
    "INSERT INTO post_comments(comment_text, sender_id, post_id) values($1,$2,$3) RETURNING id",
    [req.body.mycomment, req.body.userId, req.params.post_id]
  );

  res.json({
    ...req.body,
    status: "Comment successfully created",
  });
};

module.exports.handleGetPostComments = async (req, res) => {
  const getPostCommentsQuery = await pool.query(
    // "SELECT id post_comment_id, sender_id, comment_text FROM post_comments WHERE post_id = $1 ORDER BY created_at ASC;",
    "SELECT username sender_username, post_comments.id post_comment_id, sender_id, comment_text FROM post_comments INNER JOIN users ON post_comments.sender_id = users.id WHERE post_id = $1 ORDER BY post_comments.created_at DESC;",
    [req.params.post_id]
  );
  res.send(getPostCommentsQuery.rows); // if this is null, check for that & display a message saying no posts
};

module.exports.handleAddPostPoint = async (req, res) => {
  const getRecipientId = await pool.query(
    "SELECT sender_id FROM posts WHERE id = $1;",
    [req.body.currentPost]
  );

  const recipient_id = getRecipientId.rows[0].sender_id;

  // add a conditional that checks to make sure the user hasn't already given this post a point before

  const newPostPoint = await pool.query(
    "INSERT INTO points(recipient_id, giver_id, posts_id) values($1,$2,$3);",
    [recipient_id, req.body.userId, req.body.currentPost]
  );

  res.json({
    ...req.body,
    status: "added a point",
  });
};

module.exports.handleGetPostPoints = async (req, res) => {
  const getPostPoints = await pool.query(
    "SELECT SUM(point_value) FROM points WHERE posts_id = $1;",
    [req.body.currentPost]
  );

  const postPoints = getPostPoints.rows[0].sum;

  res.send(postPoints);
};

module.exports.handleGetUserPoints = async (req, res) => {
  const getUserPoints = await pool.query(
    "SELECT SUM(point_value) FROM points WHERE recipient_id = $1;",
    [req.body.userId]
  );

  if (getUserPoints.rows[0].sum == null) {
    userPoints = "0";
  } else {
    userPoints = getUserPoints.rows[0].sum;
  }

  res.send(userPoints);
};
