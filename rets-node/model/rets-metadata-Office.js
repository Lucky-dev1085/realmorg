const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let metaOfficeSchema = new Schema({
  ModificationTimestamp: String,
  OfficeAddress1: String,
  OfficeAOR: String,
  OfficeCity: String,
  OfficeEmail: String,
  OfficeKeyNumeric: String,
  OfficeMlsId: String,
  OfficeName: String,
  OfficePhone: String,
  OfficePostalCode: String,
  OfficeStatus: String,
  OfficeType: String

}, {
    collection: 'rets-metadata-Office'
})

module.exports = mongoose.model('rets-metadata-Office', metaOfficeSchema)