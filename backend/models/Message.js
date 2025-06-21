const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: String,              // who sent the message
  message: String,               // the actual message content
  avatar: { type: String, default: '🐱' }, // default avatar if none selected
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);