const axios = require('axios')

const db = require("../models");
const rets_metadata_Property = db.rets_metadata_Property;
const rets_metadata_Property_Calgary_Residential = db.rets_metadata_Property_Calgary_Residential;
const rets_metadata_PropertyRooms = db.rets_metadata_PropertyRooms;
const pageContentSchema = db.pageContentSchema;

let dbConfig = require('../config/db.config');

const PROPERTY_API = dbConfig.PROPERTY_API;

exports.recentList = async (req, res) => {
  rets_metadata_Property.find({}).sort({ModificationTimestamp: 'desc'}).limit(15).exec(async function(err, result) { 
    if (err) {
      res.send(err);
    } else {
      // let data = [];
      
      // let idList = [];
      
      // await result.reduce(async (accum, element) => {
      //   await accum;

      //   idList.push(element.ListingKeyNumeric);

      // }, Promise.resolve(''));

      // await axios
      //   .post(PROPERTY_API, {
      //     'idList': JSON.stringify(idList)
      //   })
      //   .then(res => {
      //     data.push({"element": result, "resource": res.data});
      //   })
      //   .catch(error => {
      //     console.error(error)
      //   });

      res.status(200).send(result);
    }
  });
};

exports.propertySearchResult = async (req, res) => {
  var query = {};
  if (req.body.city != '') query['City'] = req.body.city;
  if (req.body.subdivisionName != '') query['SubdivisionName'] = req.body.subdivisionName;
  if (req.body.propertyType != '') query['PropertyType'] = req.body.propertyType;

  let totalRecord = await rets_metadata_Property.find(query).countDocuments();

  rets_metadata_Property.find(query).sort({ModificationTimestamp: 'desc'}).limit(req.body.limit).skip(req.body.offset).exec(async function(err, result) { 
    if (err) {
      res.send(err);
    } else {
      // let data = [];

      // let idList = [];
      
      // await result.reduce(async (accum, element) => {
      //   await accum;

      //   idList.push(element.ListingKeyNumeric);

      // }, Promise.resolve(''));

      // await axios
      //   .post(PROPERTY_API, {
      //     'idList': JSON.stringify(idList)
      //   })
      //   .then(res => {
      //     data.push({"element": result, "resource": res.data});
      //   })
      //   .catch(error => {
      //     console.error(error)
      //   });

      res.status(200).send({result, totalRecord});
    }
  });
};

exports.getPropertyById = async (req, res) => {
  var query = {};
  var ListingKeyNumeric = req.body.ListingKeyNumeric;
  if (ListingKeyNumeric != '') query['ListingKeyNumeric'] = ListingKeyNumeric;
  else {
    res.status(500).send("There is not exist data");
    return;
  }
  if(req.body.City == "Calgary") {
    rets_metadata_Property_Calgary_Residential.find(query).exec(async function(err, result) { 
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(result);
      }
    });
  } else {
    rets_metadata_Property.find(query).exec(async function(err, result) { 
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(result);
      }
    });
  }
};

exports.getPropertyRoomsById = async (req, res) => {
  var query = {};
  var ListingKeyNumeric = req.body.ListingKeyNumeric;
  if (ListingKeyNumeric != '') query['ListingKeyNumeric'] = ListingKeyNumeric;
  else {
    res.status(500).send("There is not exist data");
    return;
  }
  
  rets_metadata_PropertyRooms.aggregate([{$match: query, }, {$group: {_id: '$RoomLevel'}}]).exec(async function(err, levels) { 
    if (err) {
      res.send(err);
    } else {
      rets_metadata_PropertyRooms.aggregate([{$match: query, }, {$sort: {RoomLevel: 1}}]).exec(async function(er, rooms) { 
        if (er) {
          res.send(er);
        } else {
          res.status(200).send({levels, rooms});
        }
      });
    }
  });
};

exports.getSimiliarProperty = async (req, res) => {
  var query = {};
  query['City'] = req.body.City;
  // query['SubdivisionName'] = req.body.Community;
  var ListingKeyNumeric = req.body.ListingKeyNumeric;
  if (ListingKeyNumeric != '') query['ListingKeyNumeric'] = { $ne: ListingKeyNumeric };
  else {
    res.status(500).send("There is not exist data");
    return;
  }
  if(req.body.City == "Calgary") {
    rets_metadata_Property_Calgary_Residential.find({ListingKeyNumeric: ListingKeyNumeric}).exec(async function(err, result) { 
      if (err) {
        res.send(err);
      } else {
        var SubdivisionName = result[0]['SubdivisionName'];
        query['SubdivisionName'] = SubdivisionName;

        rets_metadata_Property_Calgary_Residential.find(query).limit(4).exec(async function(err, result) { 
          if (err) {
            res.send(err);
          } else {
            res.status(200).send(result);
          }
        });
      }
    });
    
  } else {
    rets_metadata_Property.find({ListingKeyNumeric: ListingKeyNumeric}).exec(async function(err, result) { 
      if (err) {
        res.send(err);
      } else {
        var SubdivisionName = result[0]['SubdivisionName'];
        query['SubdivisionName'] = SubdivisionName;

        rets_metadata_Property.find(query).limit(4).exec(async function(err, result) { 
          if (err) {
            res.send(err);
          } else {
            res.status(200).send(result);
          }
        });
      }
    });
    
  }
};

exports.PropertyCalgarySearchResult = (req, res) => {
  var query = {};
  if (req.body.city != '') query['City'] = req.body.city;
  if (req.body.district != '') query['District'] = req.body.district;
  if (req.body.subdivisionName != '') query['SubdivisionName'] = req.body.subdivisionName;

  let data = {
    totalRecord: 0,
    avgDOM: 0,
    minListPrice: 0,
    maxListPrice: 0,
    lastModify: new Date()
  }

  if(req.body.city == "Calgary") {
    rets_metadata_Property_Calgary_Residential.aggregate([{$match: query}, {$group: { _id: '$City', totalDOM: {$sum: {$toDouble: '$DaysOnMarket' }}, minListPrice: {$min: {$toDouble: '$ListPrice' }}, maxListPrice: {$max: {$toDouble: '$ListPrice'}}, LastModify: {$max: '$ModificationTimestamp'}, count: {$sum: 1}}}]).exec(function(er, res_ag) {
      if(er) {
        res.send(er);
      } else {
        if (res_ag.length > 0) {
          data = {
            totalRecord: res_ag[0]['count'],
            avgDOM: (res_ag[0]['count'] == 0 ? res_ag[0]['totalDOM'] : (res_ag[0]['totalDOM'] / res_ag[0]['count'])),
            minListPrice: res_ag[0]['minListPrice'],
            maxListPrice: res_ag[0]['maxListPrice'],
            lastModify: res_ag[0]['LastModify']
          }
        }

        rets_metadata_Property_Calgary_Residential.find(query).sort({ModificationTimestamp: 'desc'}).limit(req.body.limit).skip(req.body.offset).exec(function(err, result) { 
          if (err) {
            res.send(err);
          } else {
            res.status(200).send({result, data});
          }
        });
      } 
    })
    
  } else {
    rets_metadata_Property.aggregate([{$match: query}, {$group: { _id: '$City', totalDOM: {$sum: {$toDouble: '$DaysOnMarket' }}, minListPrice: {$min: {$toDouble: '$ListPrice' }}, maxListPrice: {$max: '$ListPrice'}, LastModify: {$max: '$ModificationTimestamp'}, count: {$sum: 1}}}]).exec(function(er, res_ag) {
      if(er) {
        res.send(er);
      } else {
        if (res_ag.length > 0) {
          data = {
            totalRecord: res_ag[0]['count'],
            avgDOM: (res_ag[0]['count'] == 0 ? res_ag[0]['totalDOM'] : (res_ag[0]['totalDOM'] / res_ag[0]['count'])),
            minListPrice: res_ag[0]['minListPrice'],
            maxListPrice: res_ag[0]['maxListPrice'],
            lastModify: res_ag[0]['LastModify']
          }
        }

        rets_metadata_Property.find(query).sort({ModificationTimestamp: 'desc'}).limit(req.body.limit).skip(req.body.offset).exec(function(err, result) { 
          if (err) {
            res.send(err);
          } else {
            res.status(200).send({result, data});
          }
        });
      } 
    })
    
  }
  
};

exports.getPageContent = async (req, res) => {
  var query = {};
  query['city'] = req.body.city;
  query['district'] = req.body.district;
  query['community'] = req.body.community;

  pageContentSchema.find(query).exec(function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(result);
    }
  })
}

exports.savePageContent = async (req, res) => {
  var query = {};
  query['city'] = req.body.city;
  query['district'] = req.body.district;
  query['community'] = req.body.subdivisionName;

  var content = {
    heading: req.body.heading,
    subheading: req.body.subheading,
    paragraph_content: req.body.content
  }

  pageContentSchema.find(query).exec(function(err, result) {
    if(err) {
      res.send(err);
    } else if (result.length > 0) {

      if(req.body.style == "before") {
        let curContent = result[0]['before_listing_content'];

        if(req.body.type == "add") {
          curContent.push(content);
        } else if (req.body.type == "edit") {
          curContent.splice(req.body.order_num, 1, content);
        }

        pageContentSchema.updateOne(
          query, 
          {$set: {before_listing_content: curContent}},
          function(er, result) {
            console.log(er, result);
          }
        );

      } else if (req.body.style == "after") {
        let curContent = result[0]['after_listing_content'];

        if(req.body.type == "add") {
          curContent.push(content);
        } else if (req.body.type == "edit") {
          curContent.splice(req.body.order_num, 1, content);
        }

        pageContentSchema.updateOne(
          query, 
          {$set: {after_listing_content: curContent}},
          function(er, result) {
            console.log(er, result);
          }
        );
      }
    } else {
      if(req.body.style == "before") {
        let data = {
          city: req.body.city,
          district: req.body.district,
          community: req.body.subdivisionName,
          before_listing_content: content,
          after_listing_content: [],
          meta_content: {},
          social_media: {}
        }

        pageContentSchema.insertMany(data);
      } else if (req.body.style == "after") {
        let data = {
          city: req.body.city,
          district: req.body.district,
          community: req.body.subdivisionName,
          before_listing_content: [],
          after_listing_content: content,
          meta_content: {},
          social_media: {}
        }

        pageContentSchema.insertMany(data);
      }
    }

    res.status(200).send({status: 'success'});
    
  })
  
}

exports.saveMetaContent = async (req, res) => {
  var query = {};
  query['city'] = req.body.city;
  query['district'] = req.body.district;
  query['community'] = req.body.subdivisionName;

  var content = {
    title: req.body.title,
    url: req.body.url,
    keyword: req.body.keyword,
    description: req.body.description
  }

  var socialContent = {
    description: req.body.socialdescription
  }

  pageContentSchema.find(query).exec(function(err, result) {
    if(err) {
      res.send(err);
    } else if (result.length > 0) {

      if(req.body.style == "meta") {
        // let curContent = result[0]['meta_content'];

        // if(req.body.type == "add") {
        //   curContent = content;
        // } else if (req.body.type == "edit") {
        //   // curContent.splice(req.body.order_num, 1, content);
        //   curContent = content;
        // }

        pageContentSchema.updateOne(
          query, 
          {$set: {meta_content: content, social_media: socialContent}},
          function(er, result) {
            console.log(er, result);
          }
        );

      }
    } else {
      if(req.body.style == "meta") {
        let data = {
          city: req.body.city,
          district: req.body.district,
          community: req.body.subdivisionName,
          before_listing_content: [],
          after_listing_content: [],
          meta_content: content,
          social_media: socialContent
        }

        pageContentSchema.insertMany(data);
      }
    }

    res.status(200).send({status: 'success'});
    
  })
  
}

exports.clearPageContent = async (req, res) => {
  var query = {};
  query['city'] = req.body.city;
  query['district'] = req.body.district;
  query['community'] = req.body.subdivisionName;

  pageContentSchema.find(query).exec(function(err, result) {
    if(err) {
      res.send(err);
    } else if (result.length > 0) {
      if(req.body.style == "before") {
        let curContent = result[0]['before_listing_content'];

        curContent.splice(req.body.order_num, 1);

        pageContentSchema.updateOne(
          query, 
          {$set: {before_listing_content: curContent}},
          function(er, result) {
            console.log(er, result);
          }
        );
      } else if (req.body.style == "after") {
        let curContent = result[0]['after_listing_content'];

        curContent.splice(req.body.order_num, 1);

        pageContentSchema.updateOne(
          query, 
          {$set: {after_listing_content: curContent}},
          function(er, result) {
            console.log(er, result);
          }
        );
      } else if (req.body.style == "meta") {
        let curContent = result[0]['meta_content'];

        // curContent.splice(req.body.order_num, 1);

        pageContentSchema.updateOne(
          query, 
          {$set: {meta_content: {}, social_media: {}}},
          function(er, result) {
            console.log(er, result);
          }
        );
      }
    }

    res.status(200).send({status: 'success'});
  })

}