const mongoose = require("mongoose");

const verificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: {
    type: Date,
    default: new Date(Date.now() + 15 * 60 * 1000),
    index: { expires: 0 },
  },
});

module.exports = mongoose.model("VerificationCode", verificationCodeSchema);
