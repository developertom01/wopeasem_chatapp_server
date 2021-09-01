const { User } = require("../models/users");



module.exports = async (req, res, next) => {
  const { email, username } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(401).json({ detail: "Email already exists" });

    user = await User.findOne({ username });
    if (user) return res.status(401).json({ detail: "Username already exists" });
  } catch (error) {
         console.log(String(error));
         return res.status(500).json({ detail: "Server error" });
  }
  next()
};
