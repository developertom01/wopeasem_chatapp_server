const Jwt = require("jsonwebtoken");
const appConfig = require("../config/appConfig");

const login = (req, res) => {
  const user = req.user;
  const token = Jwt.sign(
    {
      sub: user._id,
      exp: Math.pow(10, 100),
    },
    appConfig.appSecrete
  );

  const response = { token: token, data: user };
  res.json(response);
};

module.exports = { login };
