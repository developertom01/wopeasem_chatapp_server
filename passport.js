const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { User } = require("./models/users");
const LocalStrategy = require("passport-local").Strategy;
const appConfig = require("./config/appConfig");

const jwt = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    issuer: "secret",
    secretOrKey: appConfig.appSecrete,
  },
  async (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.sub })
      .then((user) => {
        if (!user) return done(null, user);
        return done(null, user);
      })
      .catch((err) => {
        return done(null, false);
      });
  }
);

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }).then((user) => {
      if (!user) return done(null, false, { message: "Incorrect username" });
      if (!user.validatePassword(password))
        return done(null, false, { message: "Incorrect password" });
    });
    return done(null, user).catch((err) => {
      return done(null, false);
    });
  })
);

passport.use("jwt", jwt);
module.exports = passport;
