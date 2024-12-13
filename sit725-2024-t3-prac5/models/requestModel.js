const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  date: String,
});

module.exports = mongoose.model('Request', requestSchema);