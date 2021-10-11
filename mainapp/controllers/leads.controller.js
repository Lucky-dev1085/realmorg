const db = require("../models");
const leadTypeSchema = db.leadTypeSchema;
const leadSubTypeSchema = db.leadSubTypeSchema;
const leadStatusSchema = db.leadStatusSchema;
const leadSchema = db.leadSchema;
const teamMemberSchema = db.teamMemberSchema;
const mail = require('./mail');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getLeadTypeList = async (req, res) => {

  leadTypeSchema.find({}).exec(function(err, result) {
    if(err) {
      res.send(err);
    } else {
      res.status(200).send(result);
    }
  })
}

exports.getLeadSubTypeList = async (req, res) => {

  leadSubTypeSchema.find({ type_id: req.body.type_id }).exec(function(err, result) {
    if(err) {
      res.send(err);
    } else {
      res.status(200).send(result);
    }
  })
}

exports.getLeadStatusList = async (req, res) => {

  leadStatusSchema.find({}).exec(function(err, result) {
    if(err) {
      res.send(err);
    } else {
      res.status(200).send(result);
    }
  })
}

exports.saveLeads = async (req, res) => {
  var query = {};
  query['email'] = req.body.email;

  var leadsContent = {};

  leadSchema.find(query).exec(function(err, result) {
    if(err) {
      res.send(err);
    } else {
      if(result.length > 0) {
        var comment_list = result[0].comment_list ? result[0].comment_list : [];

        comment_list.push({date: new Date(), comment: req.body.msg, team_member: "lead"});

        leadsContent = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone: req.body.phone,
          comment: req.body.msg,
          type: req.body.lead_type,
          subtype: req.body.lead_subtype,
          comment_list: comment_list
        }
      } else {
        var comment_list = [];

        comment_list.push({date: new Date(), comment: req.body.msg, team_member: "lead"});

        leadsContent = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone: req.body.phone,
          comment: req.body.msg,
          accepted: '0',
          created_at: new Date(),
          perm_phone: '0',
          perm_text: '0',
          perm_email: '0',
          type: req.body.lead_type,
          subtype: req.body.lead_subtype,
          comment_list: comment_list,
          role: 'User'
        }
      }

      leadSchema.updateOne(
        query, 
        leadsContent,
        {upsert: true},
        function(er, result) {
          console.log(er, result);
          if(er) {
            res.send(err);
          } else {
            
            let htmlContent = '';
            if(req.body.type == "area") {
              htmlContent = `
                            <h3>Request From ${req.body.first_name} ${req.body.last_name}</h3>
                            <p>He/She want to buy house of <strong>${req.body.address}</strong></p>
                            <p style="font-style: italic;">${req.body.msg}</p>
                            <br/>
                            <p>Contact Email: ${req.body.email}</p>
                            <p>Contact Phone: ${req.body.phone}</p>
                            `;
            } else if (req.body.type == 'detail') {
              htmlContent = `
                            <h3>Request From ${req.body.first_name} ${req.body.last_name}</h3>
                            <p>He/She want to buy house of <strong>${req.body.address}</strong></p>
                            <p style="font-style: italic;">${req.body.msg}</p>
                            <br/>
                            <p>Contact Email: ${req.body.email}</p>
                            <p>Contact Phone: ${req.body.phone}</p>
                            `;
            } else if (req.body.type == 'seller') {
              htmlContent = `
                            <h3>Request From ${req.body.first_name} ${req.body.last_name}</h3>
                            <p>He/She want to sell house of <strong>${req.body.address}</strong></p>
                            <br/>
                            <p>Contact Email: ${req.body.email}</p>
                            <p>Contact Phone: ${req.body.phone}</p>
                            `;
            }
    
            let mailOptions = {
                from: "wanghuajinksh@gmail.com",
                // to: "citybest128@gmail.com",
                // to: 'guerrero.alvaro1085@gmail.com',
                to: [],
                bcc: ['guerrero.alvaro1085@gmail.com', 'citybest128@gmail.com'],
                subject: "Request From Nirbhai server",
                text: "",
                html: htmlContent
            }
    
            mail.sendMail(mailOptions)
                .then(function (email) {
                    res.status(200).json({ success: true, msg: 'Mail sent' });
                }).catch(function (exception) {
                    res.status(200).json({ success: false, msg: exception });
                }); 
          }
        }
      );
    }
  })
  
}

exports.getLeadsList = async (req, res) => {
  
  var query = {};
  if(req.body.role == 'ROLE_Team') {
    query['byTeam'] = req.body.teamId;
  }
  if(req.body.status != '') {
    query['status'] = req.body.status;
  }

  if(req.body.selYear != "") query['selYear'] = req.body.selYear;
  if(req.body.selMonth != "") query['selMonth'] = req.body.selMonth;

  await leadSchema.aggregate([
    {
      $addFields: {
        "selYear": { $convert: { input: { "$year": "$created_at" }, to: "string", onError: "", onNull: "" } },
        "selMonth": { $convert: { input: { "$month": "$created_at" }, to: "string", onError: "", onNull: "" } }
      }
    },
    { $match: query },
    {
      $count: "totalCount"
    }
  ]).exec(function(err, result) {
    if(err) {
      res.send(err);
    } else {
      let total_count = 0;
      if(result.length > 0) total_count = result[0].totalCount;

      leadSchema.aggregate([
        {
          $addFields: {
              "teamId": {
                  "$toObjectId": "$byTeam"
              },
              "statusId": {
                "$toObjectId": "$status"
              },
              "selYear": { $convert: { input: { "$year": "$created_at" }, to: "string", onError: "", onNull: "" } },
              "selMonth": { $convert: { input: { "$month": "$created_at" }, to: "string", onError: "", onNull: "" } }
          }
        },
        { $match: query },
        {
          $lookup: {
              from: "team-member",
              localField: "teamId",
              foreignField: "_id",
              as: "team_member"
          }
        },
        {
          $lookup: {
              from: "lead-status",
              localField: "statusId",
              foreignField: "_id",
              as: "lead_status"
          }
        },
        {
          $lookup: {
              from: "lead_type",
              localField: "type",
              foreignField: "_id",
              as: "lead_type"
          }
        },
        {
          $sort: {teamId: -1, first_name: 1}
        },
        {$limit: req.body.limit + req.body.offset}, {$skip: req.body.offset}
      ]).exec(function(err, result) {
        if(err) {
          res.send(err);
        } else {
          res.status(200).send({items: result, total_count});
        }
      })
      
    }
  });
  
}

exports.getLeadById = async (req, res) => {

  var query = {};
  query['leadId'] = req.body.selId;

  leadSchema.aggregate([
    {
      $addFields: {
          "leadId": {
            "$toString": "$_id"
          },
          "teamId": {
            "$toObjectId": "$byTeam"
          },
          "statusId": {
            "$toObjectId": "$status"
          }
      }
    },
    { $match: query },
    {
      $lookup: {
          from: "team-member",
          localField: "teamId",
          foreignField: "_id",
          as: "team_member"
      }
    },
    {
      $lookup: {
          from: "lead-status",
          localField: "statusId",
          foreignField: "_id",
          as: "lead_status"
      }
    },
    {
      $lookup: {
          from: "lead_type",
          localField: "type",
          foreignField: "_id",
          as: "lead_type"
      }
    },
    {
      $lookup: {
          from: "lead_subtype",
          localField: "subtype",
          foreignField: "_id",
          as: "lead_subtype"
      }
    }
  ]).exec(function(err, result) {
    if(err) {
      res.send(err);
    } else {
      res.status(200).send(result);
    }
  })
}

exports.changeByTeam = async (req, res) => {

  leadSchema.updateOne(
      {_id: req.body.selId}, 
      {$set: {byTeam: req.body.byTeam == '' ? null : req.body.byTeam, accepted: '0'}},
      function(er, result) {
        console.log(er, result);
      }
  );

  res.status(200).send({status: 'success'});
}

exports.changeStatus = async (req, res) => {

  leadSchema.updateOne(
      {_id: req.body.selId}, 
      {$set: {status: req.body.status, byTeam: req.body.byTeam, accepted: '1'}},
      function(er, result) {
        console.log(er, result);
      }
  );

  res.status(200).send({status: 'success'});
}

exports.ChangeType = async (req, res) => {

  leadSchema.updateOne(
      {_id: req.body.selId}, 
      {$set: {type: req.body.type, byTeam: req.body.byTeam, accepted: '1'}},
      function(er, result) {
        console.log(er, result);
      }
  );

  res.status(200).send({status: 'success'});
}

exports.ChangeSubType = async (req, res) => {

  leadSchema.updateOne(
      {_id: req.body.selId}, 
      {$set: {subtype: req.body.subtype, byTeam: req.body.byTeam, accepted: '1'}},
      function(er, result) {
        console.log(er, result);
      }
  );

  res.status(200).send({status: 'success'});
}

exports.saveCommnet = async (req, res) => {
  leadSchema.find({_id: req.body.selId}).exec(function(err, result) {
    if(err) {
      res.send(err);
      return;
    } else if (result.length > 0) {
      var curCommentList = result[0].comment_list;

      curCommentList.push({date: new Date(), comment: req.body.comment, team_member: req.body.team_member});

      leadSchema.updateOne(
        {_id: req.body.selId}, 
        {$set: {comment: req.body.comment, byTeam: req.body.byTeam, comment_list: curCommentList, accepted: '1'}},
        function(er, result) {
          console.log(er, result);
        }
      );
    }
  })

  res.status(200).send({status: 'success'});
}

exports.changeToMember = async (req, res) => {

  leadSchema.findById(req.body.selId).exec((err, lead) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    const password = Math.random().toString(36).slice(-8);

    const member = new teamMemberSchema({
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      password: bcrypt.hashSync(password, 8),
      status: lead.status,
      cell_phone: lead.phone,
      role: "Team",
      accepted: '0',
      created_at: lead.created_at
    });
  
    member.save((err, member) => {
      if (err) {
        res.send({
          status: "failed",
          data: {},
          msg: `Something went wrong ${err}`,
        });
        return;
      } 

      leadSchema.updateOne(
        {_id: req.body.selId}, 
        {$set: {role: 'Member'}},
        function(er, result) {
          if(er) {
            res.send({
              status: "failed",
              data: {},
              msg: `Something went wrong ${er}`,
            });
            return;
          }
        }
      );

      let htmlContent = `
          <h3>Invite to Team Member of Nirbhai.com</h3>
          <p>You can login with follow info.</p>
          <br/>
          <p>Contact Email: ${lead.email}</p>
          <p>Contact Phone: ${password}</p>
          `;

      let mailOptions = {
          from: "wanghuajinksh@gmail.com",
          to: [],
          bcc: [lead.email],
          subject: "Request From Nirbhai server",
          text: "",
          html: htmlContent
      }

      mail.sendMail(mailOptions)
          .then(function (email) {
              res.status(200).json({ success: true, msg: 'Mail sent' });
          }).catch(function (exception) {
              res.status(200).json({ success: false, msg: exception });
          }); 

      res.status(200).send({status: 'success'});
    });

  })

  
}

exports.ChangeContactAgain = async (req, res) => {

  leadSchema.updateOne(
      {_id: req.body.selId}, 
      {$set: {contact_again: req.body.contact_again, byTeam: req.body.byTeam, accepted: '1'}},
      function(er, result) {
        console.log(er, result);
      }
  );

  res.status(200).send({status: 'success'});
}

exports.permPhone = async (req, res) => {

  leadSchema.updateOne(
      {_id: req.body.selId}, 
      {$set: {perm_phone: req.body.perm, byTeam: req.body.byTeam, accepted: '1'}},
      function(er, result) {
        console.log(er, result);
      }
  );

  res.status(200).send({status: 'success'});
}

exports.permEmail = async (req, res) => {

  leadSchema.updateOne(
      {_id: req.body.selId}, 
      {$set: {perm_email: req.body.perm, byTeam: req.body.byTeam, accepted: '1'}},
      function(er, result) {
        console.log(er, result);
      }
  );

  res.status(200).send({status: 'success'});
}

exports.permText = async (req, res) => {

  leadSchema.updateOne(
      {_id: req.body.selId}, 
      {$set: {perm_text: req.body.perm, byTeam: req.body.byTeam, accepted: '1'}},
      function(er, result) {
        console.log(er, result);
      }
  );

  res.status(200).send({status: 'success'});
}

exports.createNewLead = async (req, res) => {
  var leadInfo = JSON.parse(req.body.leadInfo);

  var query = {};
  query['email'] = leadInfo.email;

  var leadsContent = {
    first_name: leadInfo.first_name,
    last_name: leadInfo.last_name,
    email: leadInfo.email,
    phone: leadInfo.phone,
    byTeam: leadInfo.byTeam,
    status: leadInfo.status,
    type: leadInfo.type,
    subtype: leadInfo.subtype,
    contact_again: leadInfo.contact_again,
    comment: leadInfo.comment,
    comment_list: leadInfo.comment_list,
    accepted: leadInfo.accepted,
    created_at: new Date(),
    perm_phone: leadInfo.perm_phone,
    perm_text: leadInfo.perm_text,
    perm_email: leadInfo.perm_email,
    role: 'User'
  }

  leadSchema.updateOne(
    query, 
    leadsContent,
    {upsert: true},
    function(er, result) {
      console.log(er, result);
      if(er) {
        res.send(err);
      } else {
        
        let htmlContent = '';
        if(req.body.type == "area") {
          htmlContent = `
                        <h3>Request From ${req.body.first_name} ${req.body.last_name}</h3>
                        <p>He/She want to buy house of <strong>${req.body.address}</strong></p>
                        <p style="font-style: italic;">${req.body.msg}</p>
                        <br/>
                        <p>Contact Email: ${req.body.email}</p>
                        <p>Contact Phone: ${req.body.phone}</p>
                        `;
        } else if (req.body.type == 'detail') {
          htmlContent = `
                        <h3>Request From ${req.body.first_name} ${req.body.last_name}</h3>
                        <p>He/She want to buy house of <strong>${req.body.address}</strong></p>
                        <p style="font-style: italic;">${req.body.msg}</p>
                        <br/>
                        <p>Contact Email: ${req.body.email}</p>
                        <p>Contact Phone: ${req.body.phone}</p>
                        `;
        } else if (req.body.type == 'seller') {
          htmlContent = `
                        <h3>Request From ${req.body.first_name} ${req.body.last_name}</h3>
                        <p>He/She want to sell house of <strong>${req.body.address}</strong></p>
                        <br/>
                        <p>Contact Email: ${req.body.email}</p>
                        <p>Contact Phone: ${req.body.phone}</p>
                        `;
        }

        let mailOptions = {
            from: "wanghuajinksh@gmail.com",
            // to: "citybest128@gmail.com",
            // to: 'guerrero.alvaro1085@gmail.com',
            to: [],
            bcc: ['guerrero.alvaro1085@gmail.com', 'citybest128@gmail.com'],
            subject: "Request From Nirbhai server",
            text: "",
            html: htmlContent
        }

        mail.sendMail(mailOptions)
            .then(function (email) {
                res.status(200).json({ success: true, msg: 'Mail sent' });
            }).catch(function (exception) {
                res.status(200).json({ success: false, msg: exception });
            }); 
      }
    }
  );
  
}

exports.editLead = async (req, res) => {
  var leadInfo = JSON.parse(req.body.leadInfo);

  console.log(leadInfo);

  var query = {};
  query['_id'] = leadInfo._id;

  var leadsContent = {
    first_name: leadInfo.first_name,
    last_name: leadInfo.last_name,
    email: leadInfo.email,
    phone: leadInfo.phone,
    byTeam: leadInfo.byTeam,
    status: leadInfo.status,
    type: leadInfo.type,
    subtype: leadInfo.subtype,
    contact_again: leadInfo.contact_again,
    comment: leadInfo.comment,
    comment_list: leadInfo.comment_list,
    accepted: leadInfo.accepted,
    perm_phone: leadInfo.perm_phone,
    perm_text: leadInfo.perm_text,
    perm_email: leadInfo.perm_email,
    role: 'User'
  }

  leadSchema.updateOne(
    query, 
    leadsContent,
    {upsert: true},
    function(er, result) {
      console.log(er, result);
      if(er) {
        res.send({
          status: "failed",
          data: {},
          msg: `Something went wrong ${er}`,
        });
      } else {
        res.send({
          status: "success",
          data: {},
          msg: `Success edited`,
        });
      }
    }
  );
  
}

exports.deleteLead = async (req, res) => {
  leadSchema.deleteOne({_id: req.body.selId}, function (err, results) {
    if (err) {
        res.send({
          status: "failed",
          data: {},
          msg: `Something went wrong ${err}`,
        });
        return;
    } 

    res.send({
        status: "success",
        data: {},
        msg: `Success deleted`,
    });
});
}