const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const userTypes = require("../config/userTypes");
const userSchema = new Schema(
  {
    name: {
      first_name: {
        type: Schema.Types.String,
        required: true,
      },
      last_name: {
        type: Schema.Types.String,
        required: true,
      },
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    user_type: {
      type: String,
      default: userTypes.user,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
userSchema.methods.comparePassword = function (passowrd) {
  return bcrypt.compareSync(passowrd, this.password);
};
const User = model("User", userSchema, "users");

module.exports = { User, userSchema };
