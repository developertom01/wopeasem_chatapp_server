const userValidator = require("../middleware/validator/validation/userValidator");
const { createAccount } = require("../controllers/usersController");
const router = require("express").Router();
const checkForDuplicatedCredentials = require("../middleware/checkForDuplicatedCredentials")

router.post("/", userValidator,checkForDuplicatedCredentials, createAccount);

module.exports = router;
