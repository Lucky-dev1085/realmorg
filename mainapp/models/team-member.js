const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let teamMemberSchema = new Schema({
  cell_phone: String,
  office_phone: String,
  email: String,
  type: String,
  comment: String,
  avatar: String,
  first_name: String,
  last_name: String,
  password: String,
  address: String,
  role: String,
  accepted: String,
  created_at: Date,
}, {
    collection: 'team-member'
})

module.exports = mongoose.model('team-member', teamMemberSchema)