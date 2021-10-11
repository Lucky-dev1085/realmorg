const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cronInfoSchema = new Schema({
  Property: Date,
  Media: Date,
  Member: Date,
  Office: Date,
  PropertyRoom: Date,
  Openhouse: Date,
  PropertyUnitTypes: Date
}, {
    collection: 'rets-cron-info'
})

module.exports = mongoose.model('rets-cron-info', cronInfoSchema)