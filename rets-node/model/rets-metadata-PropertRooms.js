const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let metaPropertyRoomsSchema = new Schema({
  ListingKeyNumeric: String,
  ModificationTimestamp: String,
  RoomArea: String,
  RoomAreaSource: String,
  RoomAreaUnits: String,
  RoomDescription: String,
  RoomDimensions: String,
  RoomFeatures: String,
  RoomKeyNumeric: String,
  RoomLength: String,
  RoomLengthWidthSource: String,
  RoomLengthWidthUnits: String,
  RoomLevel: String,
  RoomType: String,
  RoomWidth: String
}, {
    collection: 'rets-metadata-PropertyRooms'
})

module.exports = mongoose.model('rets-metadata-PropertyRooms', metaPropertyRoomsSchema)