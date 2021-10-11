const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let propertyTransactionTypechema = new Schema({
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
    collection: 'rets-property-TransactionType'
})

module.exports = mongoose.model('rets-property-TransactionType', propertyTransactionTypechema)