const db = require("../models");
const User = db.user;
const teamMemberSchema = db.teamMemberSchema;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.send({
        status: "failed",
        data: {},
        msg: `Something went wrong ${err}`,
      });
      return;
    }

    if (user) {
      res.send({
        status: "failed",
        data: {},
        msg: `Failed! Username is already in use!`,
      });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.send({
          status: "failed",
          data: {},
          msg: `Something went wrong ${err}`,
        });
        return;
      }

      if (user) {
        res.send({
          status: "failed",
          data: {},
          msg: `Failed! Email is already in use!`,
        });
        return;
      }

      next();
    });
  });
};

checkDuplicateMemberEmail = (req, res, next) => {
  // Email
  teamMemberSchema.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.send({
        status: "failed",
        data: {},
        msg: `Something went wrong ${err}`,
      });
      return;
    }

    if (user) {
      res.send({
        status: "failed",
        data: {},
        msg: `Failed! Email is already in use!`,
      });
      return;
    }

    next();
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkDuplicateMemberEmail
};

module.exports = verifySignUp;