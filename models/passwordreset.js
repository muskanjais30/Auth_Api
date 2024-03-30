
const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = PasswordReset;
