const mongoose = require('mongoose');
const GenreSchema = new mongoose.Schema({
  id: Number,
  name: String,
});
module.exports = mongoose.model('Genre', GenreSchema);
