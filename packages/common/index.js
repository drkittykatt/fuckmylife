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

const formSignupSchema = Yup.object({
  email: Yup.string()
    .required("Valid email required")
    .email("Valid email required"),
  username: Yup.string()
    .required("Username required")
    .min(6, "Username must be at least 6 characters")
    .max(12, "Username can be maximum 12 characters")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Username cannot contain white space or special characters"
    ),
  password: Yup.string()
    .required("Password required")
    .min(6, "Password must be at least 6 characters")
    .max(28, "Password too long!"),
  password2: Yup.string()
    .required("Password required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const newPasswordSchema = Yup.object({
  password: Yup.string().required("Password required"),
  passattempt1: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!"),
  passattempt2: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!")
    .oneOf([Yup.ref("passattempt1"), null], "Passwords don't match!"),
});

const forgotPasswordSchema = Yup.object({
  passcode: Yup.string().required("Passcode is required"),
  passattempt1: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!"),
  passattempt2: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!")
    .oneOf([Yup.ref("passattempt1"), null], "Passwords don't match!"),
});

const addMessageSchema = Yup.object({
  mymessage: Yup.string()
    .required("Message is required")
    .min(1, "message too short!"),
});

module.exports = {
  formSchema,
  newPasswordSchema,
  formSignupSchema,
  forgotPasswordSchema,
  addMessageSchema,
};
