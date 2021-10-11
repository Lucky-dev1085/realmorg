const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let pageContentSchema = new Schema({
  city: String,
  district: String,
  community: String,
  meta_content: {
    title: String,
    url: String,
    keyword: String,
    description: String
  },
  social_media: {
    description: String
  },
  before_listing_content: [{
    heading: String,
    subheading: String,
    paragraph_content: String
  }],
  after_listing_content: [{
    heading: String,
    subheading: String,
    paragraph_content: String
  }]
}, {
    collection: 'pages-content'
})

module.exports = mongoose.model('pages-content', pageContentSchema)