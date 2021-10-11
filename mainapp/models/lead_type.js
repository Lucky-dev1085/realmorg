const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let leadTypeSchema = new Schema({
  type: String
}, {
    collection: 'lead_type'
})

module.exports = mongoose.model('lead_type', leadTypeSchema)