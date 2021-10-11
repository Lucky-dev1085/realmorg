var express = require('express');
let fs = require('fs');
const multer = require('multer');
var fileExtension = require('file-extension');

var router = express.Router();

/* GET users listing. */
router.post('/getList', async function(req, res, next) {
  var data = [];

  let idList = JSON.parse(req.body.idList);

  await idList.reduce(async (accum, ListingKeyNumeric) => {
    await accum;

    var fileDoc = [];
    var fileLarge = [];
    var filePhoto = [];
    var fileXLarge = [];

    await fs.readdirSync("./data/Media/Document").forEach(file => {
        
        if(file.includes(ListingKeyNumeric + "_")) {
          fileDoc.push(file);
        }
    });

    await fs.readdirSync("./data/Media/LargePhoto").forEach(file => {

        if(file.includes(ListingKeyNumeric + "_")) {
          fileLarge.push(file);
        }
    });

    await fs.readdirSync("./data/Media/Photo").forEach(file => {

        if(file.includes(ListingKeyNumeric + "_")) {
          filePhoto.push(file);
        }
    });

    // await fs.readdirSync("./data/Media/XLarge").forEach(file => {

    //     if(file.includes(ListingKeyNumeric + "_")) {
    //       fileXLarge.push(file);
    //     }
    // });

    let fileArr = [{"Doc": fileDoc, "Large": fileLarge, "Photo": filePhoto, "XLarge": fileXLarge}];

    data.push({id: ListingKeyNumeric, fileArr: fileArr});

  }, Promise.resolve(''));

  res.status(200).send(data);
});

// Configure Storage
var storage = multer.diskStorage({

  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
      cb(null, './data/Media/PageContent')
  },

  // Setting name of file saved
  filename: function (req, file, cb) {
      // cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
      cb(null, file.originalname.substr(0, file.originalname.lastIndexOf(".")) + '-' + Date.now() + '.' + fileExtension(file.originalname))
  }
})

var upload = multer({
  storage: storage,
  limits: {
      // Setting Image Size Limit to 2MBs
      fileSize: 20000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          //Error 
          cb(new Error('Please upload JPG and PNG images only!'))
      }
      //Success 
      cb(undefined, true)
  }
})

router.post('/uploadfile', upload.single('uploadedImage'), (req, res, next) => {
  const file = req.file
  // console.log(req);
  if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
  }
  res.status(200).send({
      statusCode: 200,
      status: 'success',
      uploadedFile: file
  })

}, (error, req, res, next) => {
  res.status(400).send({
      error: error.message
  })
})

// Configure Storage
var storageTeam = multer.diskStorage({

  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
      cb(null, './data/Media/TeamMember')
  },

  // Setting name of file saved
  filename: function (req, file, cb) {
      // cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
      cb(null, file.originalname.substr(0, file.originalname.lastIndexOf(".")) + '-' + Date.now() + '.' + fileExtension(file.originalname))
  }
})

var uploadTeam = multer({
  storage: storageTeam,
  limits: {
      // Setting Image Size Limit to 2MBs
      fileSize: 20000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          //Error 
          cb(new Error('Please upload JPG and PNG images only!'))
      }
      //Success 
      cb(undefined, true)
  }
})

router.post('/uploadMemberAvatar', uploadTeam.single('uploadedImage'), (req, res, next) => {
  const file = req.file
  // console.log(req);
  if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
  }
  res.status(200).send({
      statusCode: 200,
      status: 'success',
      uploadedFile: file
  })

}, (error, req, res, next) => {
  res.status(400).send({
      error: error.message
  })
})

module.exports = router;
