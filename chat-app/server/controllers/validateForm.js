const Yup = require("yup");

const FormSchema = Yup.object({
  username: Yup.string()
    .required("Username required")
    .min(6, "Username is too short")
    .max(28, "Username is too long"),
  password: Yup.string()
    .required("Password required")
    .min(6, "Password is too short")
    .max(28, "Password is too long"),
});

const validateForm = (req, res, next) => {
  const formData = req.body;
  FormSchema.validate(formData)
    .catch((err) => {
      res.status(422).send();
    })
    .then((valid) => {
      if (valid) {
        next();
      } else {
        res.status(422).send();
      }
    });
};

module.exports = validateForm;
