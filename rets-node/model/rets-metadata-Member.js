const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let metaMemberSchema = new Schema({
  MemberAddress1: String,
  MemberAOR: String,
  MemberCity: String,
  MemberDirectPhone: String,
  MemberEmail: String,
  MemberFirstName: String,
  MemberFullName: String,
  MemberKeyNumeric: String,
  MemberLastName: String,
  MemberMlsId: String,
  MemberMlsSecurityClass: String,
  MemberPostalCode: String,
  MemberStatus: String,
  MemberType: String,
  ModificationTimestamp: String,
  OfficeKeyNumeric: String,
  OfficeMlsId: String
}, {
    collection: 'rets-metadata-Member'
})

module.exports = mongoose.model('rets-metadata-Member', metaMemberSchema)