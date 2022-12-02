const { formSignupSchema } = require("@whatsapp-clone/common");

const validateSignupForm = (req, res, next) => {
  const formData = req.body;
  formSignupSchema
    .validate(formData)
    .catch(() => {
      res.status(422).send();
    })
    .then((valid) => {
      if (valid) {
        console.log("form is good");
        next();
      } else {
        res.status(422).send();
      }
    });
};

module.exports = validateSignupForm;
