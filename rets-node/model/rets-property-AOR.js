const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let propertyAORSchema = new Schema({
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
    collection: 'rets-property-AOR'
})

module.exports = mongoose.model('rets-property-AOR', propertyAORSchema)