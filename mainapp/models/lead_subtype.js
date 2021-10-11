const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let leadSubTypeSchema = new Schema({
  type_id: Schema.Types.ObjectId,
  subtype: String
}, {
    collection: 'lead_subtype'
})

module.exports = mongoose.model('lead_subtype', leadSubTypeSchema)