var express = require('express');
var router = express.Router();
var aws = "/conversion";

var bucket_name = 'bucket-dist-receptor'
var r_bucket_name = 'bucket-dist-emisor'

//const fs = require('fs');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const url = require('url');

const s3 = new AWS.S3({region:"sa-east-1"});

const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket_name,
    acl: 'public-read',
    key: function (req, file, cb) {
      var newFileName=path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname);
      var fullPath = 'images/'+ newFileName;
      document.cookie="pathfile="+fullPath;
      cb(null, fullPath);
    }
  }),
  limits: { fileSize: 50000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('upload');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('conversion', { title: 'Conversion' });
});

function retrieveFile(filename, res) {
  console.log(filename);

  const getParams = {
    Bucket: r_bucket_name,
    Key: filename,
    
  };
  const wt={
    Bucket: r_bucket_name,
    Key: filename,
    $waiter: {
      maxAttempts: 5,
      delay: 3
    }
  }
  s3.waitFor('objectExists', wt, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else{ //success
      s3.getObject(getParams, function (err, data) {
        if (err) {
          return res.status(400).send({ success: false, err: err });
        }
        else {
          return res.send(data.Body);
        }
      });
    }
  });
/*
  s3.getObject(getParams, function (err, data) {
    if (err) {
      return res.status(400).send({ success: false, err: err });
    }
    else {
      return res.send(data.Body);
    }
  });*/
}


router.get('/get_file/:file_name',(req,res)=>{
  retrieveFile("images/"+req.params.file_name, res);
});

router.post('/image', function (req, res, next) {
  profileImgUpload(req, res, (error) => {
    if (error) {
      console.log('errors', error);
      res.json({ error: error });
    } else {
      if (req.file === undefined) {
        console.log('Error: No File Selected!');
        res.json('Error: No File Selected');
      } else {
        //res.cookie('filename', req.file.);
        console.log("success");
        res.render('conversion_wait', { title: 'Espera...', text: 'La imagen está siendo procesada' });
      }
    }
  });
});

router.get('/conversion_wait',function(req, res, next){
  //retrieveFile("images/"+filename+".pdf", res);
});


router.post('/audio', function (req, res, next) {
  //AQUI VA LA MAGIA
  res.render('conversion_wait', { title: 'Espera...', text: 'El audio está siendo procesado' });
})

router.post('/video', function (req, res, next) {
  //AQUI VA LA MAGIA
  res.render('conversion_wait', { title: 'Espera...', text: 'El video está siendo procesado' });
})

module.exports = router;
