const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let mediaTypeSchema = new Schema({
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
    collection: 'rets-media-MediaType'
})

module.exports = mongoose.model('rets-media-MediaType', mediaTypeSchema)