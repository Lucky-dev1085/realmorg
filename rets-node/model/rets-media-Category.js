const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let mediaCategorySchema = new Schema({
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
    collection: 'rets-media-MediaCategory'
})

module.exports = mongoose.model('rets-media-MediaCategory', mediaCategorySchema)