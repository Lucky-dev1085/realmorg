const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let officeTypeSchema = new Schema({
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
    collection: 'rets-office-OfficeType'
})

module.exports = mongoose.model('rets-office-OfficeType', officeTypeSchema)