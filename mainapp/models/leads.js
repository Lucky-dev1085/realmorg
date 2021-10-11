const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let leadSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  byTeam: String,
  comment: String,
  status: String,
  comment_list: [
    {
      date: Date,
      team_member: String,
      comment: String
    }
  ],
  contact_again: Date,
  type: Schema.Types.ObjectId,
  subtype: Schema.Types.ObjectId,
  accepted: String,
  created_at: Date,
  perm_phone: String,
  perm_email: String,
  perm_text: String,
  role: String
}, {
    collection: 'leads'
})

module.exports = mongoose.model('leads', leadSchema)