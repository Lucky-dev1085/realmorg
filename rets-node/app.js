var express = require('express');
var path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
let cron = require('node-cron');
let dbConfig = require('./db');
let uploadController = require('./contollers/uploadServerController');
let deleteServerDataController = require('./contollers/deleteServerDataController');

var indexRouter = require('./routes/index');
var resourceRouter = require('./routes/resource.routers');
var conMsg = "";

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('Database sucessfully connected!');
  conMsg = 'Database sucessfully connected!';
},
  error => {
    console.log('Could not connect to database : ' + error)
    conMsg = '=====  : ' + error + " : -------------" + dbConfig.db;
  }
)

var app = express();

app.use(cors({origin: '*'}));

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//setting middleware
app.use('/resources/doc', express.static(path.join(__dirname, 'data/Media/Document'))); 
app.use('/resources/large', express.static(path.join(__dirname, 'data/Media/LargePhoto'))); 
app.use('/resources/xlarge', express.static(path.join(__dirname, 'data/Media/XLarge'))); 
app.use('/resources/photo', express.static(path.join(__dirname, 'data/Media/Photo'))); 
app.use('/resources/PageContent', express.static(path.join(__dirname, 'data/Media/PageContent'))); 
app.use('/resources/TeamMember', express.static(path.join(__dirname, 'data/Media/TeamMember'))); 

app.use('/', indexRouter);
app.use('/resources', resourceRouter);
app.use('/checkDB', function(req, res) {
  res.json(conMsg);
})
app.get('/deleteSoldData', deleteServerDataController.deleteSoldData);

/*****************************************************************************
 * second(optional), minute, hour, day of month, month, day of week
 *****************************************************************************/

cron.schedule('0 59 23 * * *', function() {
  console.log('---------------------');
  console.log('Running Cron Job  23:59:00 Update Date from RETS to my server.');
  console.log('---------------------');
  
  uploadController.uploadDataToServer();
});

cron.schedule('0 30 22 * * *', function() {
  console.log('---------------------');
  console.log('Running Cron Job  22:30:00 Delete Sold data and record from Property collection ');
  console.log('---------------------');
  
  deleteServerDataController.deleteSoldData();
});

module.exports = app;
