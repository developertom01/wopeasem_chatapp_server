const userValidator = require("../middleware/validator/validation/userValidator");
const { createAccount, listAllUsers } = require("../controllers/usersController");
const router = require("express").Router();
const checkForDuplicatedCredentials = require("../middleware/checkForDuplicatedCredentials")

router.post("/", userValidator,checkForDuplicatedCredentials, createAccount);
router.get("/", listAllUsers);
module.exports = router;
