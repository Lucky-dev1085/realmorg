const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let officeAORSchema = new Schema({
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
    collection: 'rets-office-AOR'
})

module.exports = mongoose.model('rets-office-AOR', officeAORSchema)