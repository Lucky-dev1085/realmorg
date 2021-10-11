const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let metaOpenhouseSchema = new Schema({
  ListingKeyNumeric: String,
  ModificationTimestamp: String,
  OpenHouseDate: String,
  OpenHouseEndTime: String,
  OpenHouseKeyNumeric: String,
  OpenHouseRemarks: String,
  OpenHouseStartTime: String,
  OpenHouseStatus: String,
  OpenHouseType: String,
  VirtualOpenHouseURL: String
}, {
    collection: 'rets-metadata-Openhouse'
})

module.exports = mongoose.model('rets-metadata-Openhouse', metaOpenhouseSchema)