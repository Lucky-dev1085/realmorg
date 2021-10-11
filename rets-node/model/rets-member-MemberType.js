const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let memberTypeSchema = new Schema({
  'Value': {
    type: String
  },
  'Short Value': {
    type: String
  },
  'Long Value': {
    type: String
  }
}, {
    collection: 'rets-member-MemberType'
})

module.exports = mongoose.model('rets-member-MemberType', memberTypeSchema)