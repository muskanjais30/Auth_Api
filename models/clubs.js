const mongoose = require('mongoose');

const clubSchema = mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true
    },
    collegeUni: {
      type: String,
      required: true
    },
    email: {
        type: String,
        required: true
      },
    city: {
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

module.exports = mongoose.model("Clubs", clubSchema);
