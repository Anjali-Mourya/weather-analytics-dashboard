const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  city: String,
  data: Object,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Search', SearchSchema);