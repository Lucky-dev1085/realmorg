const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let propertyArchitecturalStyleSchema = new Schema({
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
    collection: 'rets-property-ArchitecturalStyle'
})

module.exports = mongoose.model('rets-property-ArchitecturalStyle', propertyArchitecturalStyleSchema)