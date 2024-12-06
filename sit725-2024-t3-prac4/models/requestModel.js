const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  id: Number,
  description: String,
  date: String,
  status: String,
});

module.exports = mongoose.model('Request', requestSchema);
