const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: String,
  cell_phone: String,
  office_phone: String,
  memtype: String,
  content: String,
  avatar: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
