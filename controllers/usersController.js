const { User } = require("../models/users");

//Create User
const createAccount = async (req, res) => {
  let user = new User({
    ...req.body,
    first_name: undefined,
    last_name: undefined,
    name: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    },
  });
  try {
    user = await user.save();
    const response = {
      status: "success",
      data: user,
    };
    res.status(201).json(response);
  } catch (error) {
    console.log(String(error));
    res.status(500).json({ detail: "Server error" });
  }
};

//List all Users -- Admin session

const listAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(String(error));
    res.status(500).json({ detail: "Server error" });
  }
};

//Update User information

// Delete User  -- Admin session

//Delete Acount

//Reset password

// Change email

module.exports = { createAccount, listAllUsers };
