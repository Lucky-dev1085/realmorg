const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let memberAORSchema = new Schema({
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
    collection: 'rets-member-AOR'
})

module.exports = mongoose.model('rets-member-AOR', memberAORSchema)