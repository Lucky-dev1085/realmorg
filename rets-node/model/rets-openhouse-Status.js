const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let openhouseStatusSchema = new Schema({
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
    collection: 'rets-openhouse-OpenHouseStatus'
})

module.exports = mongoose.model('rets-openhouse-OpenHouseStatus', openhouseStatusSchema)