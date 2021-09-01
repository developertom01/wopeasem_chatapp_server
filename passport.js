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
  new LocalStrategy(async (username, password, done) => {
    console.log(username);
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false);
      else if (!user.validatePassword(password)) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(null, false);
    }
  })
);

passport.use("jwt", jwt);
module.exports = passport;
