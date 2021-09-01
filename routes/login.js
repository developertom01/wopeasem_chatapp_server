const passport = require("passport");
const { login } = require("../controllers/loginController");
const loginValidator = require("../middleware/validator/validation/loginValidator");

const router = require("express").Router();

router.post(
  "/login",
  loginValidator,
  passport.authenticate("local", { session: false }),
  login
);

module.exports = router;
