const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  userId: String,
  note: String,
  moderator: String,
  noteDate: String,
});

module.exports = model("notesSchema", noteSchema, "userNotes");
