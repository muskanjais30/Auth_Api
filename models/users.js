const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    verificationCode: {
      type: String
    },
    token: {
      type: String
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Users", userSchema);
