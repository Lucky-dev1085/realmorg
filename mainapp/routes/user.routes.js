const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/user/getTeamList", controller.getTeamList);

  app.post("/api/user/getTeamListAll", controller.getTeamListAll);

  app.post("/api/user/changeType", controller.changeType);

  app.post("/api/user/changeComment", controller.changeComment);

  app.post("/api/user/createNewMember",
  [
    verifySignUp.checkDuplicateMemberEmail,
  ],
  controller.createNewMember);

  app.post("/api/user/saveMember", controller.saveMember);

  app.post("/api/user/deleteMember", controller.deleteMember);

  app.post("/api/user/changePwd", controller.changePwd);

};