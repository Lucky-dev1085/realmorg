const config = require("../config/auth.config");

const db = require("../models");
const User = db.user;
const teamMemberSchema = db.teamMemberSchema;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role
  });

  user.save((err, user) => {
    if (err) {
      res.send({
        status: "failed",
        data: {},
        msg: `Something went wrong ${err}`,
      });
      return;
    } 

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    var authorities = "ROLE_" + user.role;

    res.status(200).send({status: "success", data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: authorities,
      cell_phone: user.cell_phone,
      office_phone: user.office_phone,
      avatar: user.avatar,
      content: user.content,
      memtype: user.memtype,
      accessToken: token
    }, msg: ""});
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (!user) {
        return res.status(200).send({ status: "failed", data: {}, msg: "No UserId / Password Found" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(200).send({ status: "failed", data: {}, msg: "No UserId / Password Found" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = "ROLE_" + user.role;

      res.status(200).send({status: "success", data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: authorities,
        cell_phone: user.cell_phone,
        office_phone: user.office_phone,
        avatar: user.avatar,
        content: user.content,
        memtype: user.memtype,
        accessToken: token
      }, msg: ""});
    });
};

exports.signup_member = (req, res) => {
  const member = new teamMemberSchema({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role
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

    var token = jwt.sign({ id: member.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    var authorities = "ROLE_" + member.role;

    res.status(200).send({status: "success", data: {
      id: member._id,
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      role: authorities,
      cell_phone: member.cell_phone,
      office_phone: member.office_phone,
      avatar: member.avatar,
      comment: member.comment,
      type: member.type,
      status: member.status,
      address: member.address,
      accessToken: token
    }, msg: ""});
  });
};

exports.signin_member = (req, res) => {
  teamMemberSchema.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, member) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (!member) {
        return res.status(200).send({ status: "failed", data: {}, msg: "No MemberId / Password Found" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        member.password
      );

      if (!passwordIsValid) {
        return res.status(200).send({ status: "failed", data: {}, msg: "No MemberId / Password Found" });
      }

      var token = jwt.sign({ id: member.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = "ROLE_" + member.role;

      res.status(200).send({status: "success", data: {
        id: member._id,
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        role: authorities,
        cell_phone: member.cell_phone,
        office_phone: member.office_phone,
        avatar: member.avatar,
        comment: member.comment,
        type: member.type,
        status: member.status,
        address: member.address,
        accessToken: token
      }, msg: ""});
    });
};