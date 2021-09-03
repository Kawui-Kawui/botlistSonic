const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  id: { type: String },
  prefix: { type: String },
  desc1: { type: String },
  desc2: { type: String },
  invit: { type: String },
  owner: { type: String },
  name: { type: String },
  tags: [],
  web: { type: String },
  suport: { type: String },
  avar: { type: String },
  start: { type: Number, default: 0 },
});
module.exports = mongoose.model("res", schema);
