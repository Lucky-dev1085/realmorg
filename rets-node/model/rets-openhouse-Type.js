const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let openhouseTypeSchema = new Schema({
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
    collection: 'rets-openhouse-OpenHouseType'
})

module.exports = mongoose.model('rets-openhouse-OpenHouseType', openhouseTypeSchema)