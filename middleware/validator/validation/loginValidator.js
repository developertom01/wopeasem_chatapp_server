const validator = require("../validator");

module.exports = (req, res, next) => {
  const rules = {
    username: "required|string",
    password: "required|string",
  };

  validator(req.body, rules, {}, (err, status) => {
    if (!status) return res.status(400).json(err.errors);
    next();
  });
};
