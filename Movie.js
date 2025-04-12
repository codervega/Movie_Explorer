const mongoose = require('mongoose');
const MovieSchema = new mongoose.Schema({
  id: Number,
  title: String,
  release_date: String,
  genres: [Number],
  cast: [Number],
  popularity: Number,
  vote_average: Number,
  vote_count: Number,
  revenue: Number,
});
module.exports = mongoose.model('Movie', MovieSchema);
