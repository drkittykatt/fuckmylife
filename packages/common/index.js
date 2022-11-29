const Yup = require("yup");

const formSchema = Yup.object({
  username: Yup.string()
    .required("Username required")
    .min(6, "Username too short")
    .max(28, "Username too long!"),
  password: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!"),
});

const newPasswordSchema = Yup.object({
  passattempt1: Yup.string()
    .required("Username required")
    .min(6, "Username too short")
    .max(28, "Username too long!"),
  passattempt2: Yup.string()
    .required("Password required")
    .min(6, "Username too short")
    .max(28, "Username too long!")
    .oneOf([Yup.ref("passattempt1"), null], "Passwords don't match!"),
});

module.exports = { formSchema, newPasswordSchema };
