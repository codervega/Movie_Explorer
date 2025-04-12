const mongoose = require('mongoose');
const CastSchema = new mongoose.Schema({
  id: Number,
  name: String,
  character: String,
  profile_path: String,
});
module.exports = mongoose.model('Cast', CastSchema);
