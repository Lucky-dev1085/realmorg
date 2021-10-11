let retsController = require('./getRETSController');

exports.uploadDataToServer = function(req, res) {
    console.log("This part Cron job.");
    retsController.getNewData();
}