const { EntitySchema } = require("typeorm");

// export default new EntitySchema({
module.exports = new EntitySchema({
  name: "Group",
  tableName: "groups",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    description: {
      type: "varchar",
    },
    isPublic: {
      type: "boolean",
    },
  },
});
