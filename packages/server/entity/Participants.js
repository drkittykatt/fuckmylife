import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Group",
  tableName: "groups",
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
