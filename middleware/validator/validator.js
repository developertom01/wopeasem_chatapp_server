const Validator = require("validatorjs");

const validator = (data, rules, customMessages, calback) => {
  const validation = new Validator(data, rules, customMessages);
  validation.passes(() => calback(null, true));
  validation.fails(() => calback(validation.errors, false));
};
module.exports = validator