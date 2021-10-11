const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let metaPropertyUnitTypeSchema = new Schema({
  ListingKeyNumeric: String,
  ModificationTimestamp: String,
  UnitTypeActualRent: String,
  UnitTypeBathsTotal: String,
  UnitTypeBedsTotal: String,
  UnitTypeDescription: String,
  UnitTypeKeyNumeric: String,
  UnitTypeTotalRent: String,
  UnitTypeType: String,
  UnitTypeUnitsTotal: String
}, {
    collection: 'rets-metadata-PropertyUnitTypes'
})

module.exports = mongoose.model('rets-metadata-PropertyUnitTypes', metaPropertyUnitTypeSchema)