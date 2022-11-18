const { EntitySchema } = require("typeorm");

// export default new EntitySchema({
module.exports = new EntitySchema({
  name: "Participant",
  tableName: "participants",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    isAdmin: {
      type: "boolean",
    },
  },
  relations: {
    users: {
      target: "User",
      type: "many-to-one",
      joinTable: true,
      cascade: true,
    },
    groups: {
      target: "Group",
      type: "many-to-one",
      joinTable: true,
      cascade: true,
    },
  },
});
