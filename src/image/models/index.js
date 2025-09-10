const mongoose = require("mongoose");
const imageSchema = mongoose.Schema(
  {
    path: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
