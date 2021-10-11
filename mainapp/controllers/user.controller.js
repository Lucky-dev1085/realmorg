const db = require("../models");
const user = db.user;
const teamMemberSchema = db.teamMemberSchema;
const mail = require('./mail');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getTeamList = async (req, res) => {
    var query = {};
    query['role'] = 'Team';

    let total_count = await teamMemberSchema.find(query).countDocuments();

    teamMemberSchema.find(query).limit(req.body.limit).skip(req.body.offset).exec(function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send({ items: result, total_count });
        }
    })
}

exports.getTeamListAll = async (req, res) => {
    var query = {};
    query['role'] = 'Team';

    let total_count = await teamMemberSchema.find(query).countDocuments();

    teamMemberSchema.find(query).exec(function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send({ items: result, total_count });
        }
    })
}

exports.changeType = async (req, res) => {

    teamMemberSchema.updateOne(
        {_id: req.body.selId}, 
        {$set: {type: req.body.type}},
        function(er, result) {
          console.log(er, result);
        }
    );
  
    res.status(200).send({status: 'success'});
}
  
exports.changeComment = async (req, res) => {
  
    teamMemberSchema.updateOne(
        {_id: req.body.selId}, 
        {$set: {comment: req.body.comment}},
        function(er, result) {
          console.log(er, result);
        }
    );
  
    res.status(200).send({status: 'success'});
}

exports.createNewMember = (req, res) => {
    const password = Math.random().toString(36).slice(-8);

    const member = new teamMemberSchema({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      type: req.body.type,
      email: req.body.email,
      password: bcrypt.hashSync(password, 8),
      cell_phone: req.body.cell_phone,
      office_phone: req.body.office_phone,
      content: req.body.content,
      avatar: req.body.avatar,
      address: req.body.address,
      role: 'Team',
      accepted: '0',
      created_at: new Date()
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
  
      let htmlContent = `
          <h3>Invite to Team Member of Nirbhai.com</h3>
          <p>You can login with follow info.</p>
          <br/>
          <p>Contact Email: ${req.body.email}</p>
          <p>Contact Phone: ${password}</p>
          `;

      let mailOptions = {
          from: "wanghuajinksh@gmail.com",
          to: [],
          bcc: [req.body.email],
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
  
      res.status(200).send({status: "success", data: {}, msg: "Sent Email to " + req.body.email });
    });
};

exports.saveMember = (req, res) => {

    const member = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      type: req.body.type,
      email: req.body.email,
      cell_phone: req.body.cell_phone,
      office_phone: req.body.office_phone,
      content: req.body.content,
      avatar: req.body.avatar,
      address: req.body.address,
      role: 'Team'
    };
  
    teamMemberSchema.updateOne(
        {_id: req.body.selId}, 
        {$set: member},
        function(err, result) {
            if (err) {
                res.send({
                  status: "failed",
                  data: {},
                  msg: `Something went wrong ${err}`,
                });
                return;
            } 
        
            res.status(200).send({status: "success", data: {}, msg: "Save Member Data" });
        }
    );
};

exports.deleteMember = (req, res) => {
    teamMemberSchema.deleteOne({_id: req.body.selId}, function (err, results) {
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

exports.changePwd = (req, res) => {

    const password = Math.random().toString(36).slice(-8);

    const member = {
      password: bcrypt.hashSync(password, 8)
    };
  
    teamMemberSchema.updateOne(
        {_id: req.body.selId}, 
        {$set: member},
        function(err, result) {
            if (err) {
                res.send({
                  status: "failed",
                  data: {},
                  msg: `Something went wrong ${err}`,
                });
                return;
            } 

            let htmlContent = `
                <h3>Invite to Team Member of Nirbhai.com</h3>
                <p>Your Password changed. You can login following info.</p>
                <br/>
                <p>Contact Email: ${req.body.email}</p>
                <p>Contact Phone: ${password}</p>
                `;

            let mailOptions = {
                from: "wanghuajinksh@gmail.com",
                to: [],
                bcc: [req.body.email],
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
        
            res.status(200).send({status: "success", data: {}, msg: "Save Member Data" });
        }
    );
};