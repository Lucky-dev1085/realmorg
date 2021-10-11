const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let metaMediaSchema = new Schema({
  LongDescription: String,
  MediaCategory: String,
  MediaKeyNumeric: String,
  MediaType: String,
  ModificationTimestamp: String,
  Order: String,
  OriginatingSystemMediaKey: String,
  OriginatingSystemName: String,
  PreferredPhotoYN: String,
  ResourceName: String,
  ResourceRecordKeyNumeric: String
}, {
    collection: 'rets-metadata-Media'
})

module.exports = mongoose.model('rets-metadata-Media', metaMediaSchema)