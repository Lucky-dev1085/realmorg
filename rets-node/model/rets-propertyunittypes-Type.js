const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let propertyUnitTypesTypeSchema = new Schema({
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
    collection: 'rets-propertyunittypes-UnitTypeType'
})

module.exports = mongoose.model('rets-propertyunittypes-UnitTypeType', propertyUnitTypesTypeSchema)