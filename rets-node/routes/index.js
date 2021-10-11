var express = require('express');
var router = express.Router();

let retsController = require('../contollers/getRETSController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET RETS MetaData. */
router.get('/get_rets_data', retsController.getMetaData);
router.get('/get_rets_data_from/:city', retsController.getMetaDataFromCity);
router.get('/get_new_rets_data', retsController.getNewData);

module.exports = router;
