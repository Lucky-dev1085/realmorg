const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let propertyRoomsTypeSchema = new Schema({
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
    collection: 'rets-propertyrooms-RoomType'
})

module.exports = mongoose.model('rets-propertyrooms-RoomType', propertyRoomsTypeSchema)