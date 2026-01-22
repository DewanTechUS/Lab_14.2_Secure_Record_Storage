const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },

  // ownership field
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Note", noteSchema);
