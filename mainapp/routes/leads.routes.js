const { authJwt } = require("../middlewares");
const controller = require("../controllers/leads.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/leads/getLeadTypeList", controller.getLeadTypeList);

  app.post("/api/leads/getLeadSubTypeList", controller.getLeadSubTypeList);

  app.post("/api/leads/getLeadStatusList", controller.getLeadStatusList);

  app.post("/api/leads/saveLeads", controller.saveLeads);

  app.post("/api/leads/getLeadsList", controller.getLeadsList);

  app.post("/api/leads/getLeadById", controller.getLeadById);

  app.post("/api/leads/changeByTeam", controller.changeByTeam);
  
  app.post("/api/leads/changeStatus", controller.changeStatus);

  app.post("/api/leads/ChangeType", controller.ChangeType);

  app.post("/api/leads/ChangeSubType", controller.ChangeSubType);

  app.post("/api/leads/saveCommnet", controller.saveCommnet);

  app.post("/api/leads/changeToMember", controller.changeToMember);

  app.post("/api/leads/ChangeContactAgain", controller.ChangeContactAgain);

  app.post("/api/leads/permPhone", controller.permPhone);

  app.post("/api/leads/permEmail", controller.permEmail);

  app.post("/api/leads/permText", controller.permText);

  app.post("/api/leads/createNewLead", controller.createNewLead);

  app.post("/api/leads/editLead", controller.editLead);

  app.post("/api/leads/deleteLead", controller.deleteLead);
};