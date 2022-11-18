const { EntitySchema } = require("typeorm");

// export default new EntitySchema({
module.exports = new EntitySchema({
  name: "Message",
  tableName: "messages",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    text: {
      type: "varchar",
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
