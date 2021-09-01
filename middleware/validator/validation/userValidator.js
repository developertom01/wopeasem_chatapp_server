const validator = require("../validator");

const userValidator= (req, res, next) => {
  const rules = {
    first_name: "required|string",
    last_name: "required|string",
    email: "required|email",
    password: "required|string|confirmed",
    username: "required|string",
  };
  validator(req.body, rules, {}, (err, status) => {
    if (!status) return res.status(400).json(err.errors);
    next();
  });
};

module.exports = userValidator;
