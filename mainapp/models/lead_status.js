const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let leadStatusSchema = new Schema({
  status: String
}, {
    collection: 'lead-status'
})

module.exports = mongoose.model('lead-status', leadStatusSchema)