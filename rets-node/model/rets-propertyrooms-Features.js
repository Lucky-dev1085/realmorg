const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let propertyRoomsFeatureSchema = new Schema({
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
    collection: 'rets-propertyrooms-RoomFeatures'
})

module.exports = mongoose.model('rets-propertyrooms-RoomFeatures', propertyRoomsFeatureSchema)