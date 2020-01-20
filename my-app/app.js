var createError = require('http-errors');
var express = require('express');
var multer = require('multer')
var cors = require('cors');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const keys = require('./src/keys.js');
const fs = require('fs');
var app = express();
app.use(cors())
const path = require('path');
const IncomingForm = require('formidable').IncomingForm

const r_bucket_name = 'bucket-dist-receptor'
const e_bucket_name = 'bucket-dist-emisor'

const s3 = new AWS.S3({
  accessKeyId: keys.iam_access_id,
  secretAccessKey: keys.iam_secret,
  region: "sa-east-1"
});

// view engine setup

const imgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: r_bucket_name,
    acl: 'public-read',
    key: function (req, file, cb) {
      var newFileName = path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname);
      var fullPath = 'images/' + newFileName;
      cb(null, fullPath);
    }
  }),
  limits: { fileSize: 10000000 } // In bytes: 2000000 bytes = 2 MB
}).single('file');

const audioUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: r_bucket_name,
    acl: 'public-read',
    key: function (req, file, cb) {
      var newFileName = path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname);
      var fullPath = 'audio/' + newFileName;
      cb(null, fullPath);
    }
  }),
  limits: { fileSize: 10000000 } // In bytes: 2000000 bytes = 2 MB
}).single('file');

const videoUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: r_bucket_name,
    acl: 'public-read',
    key: function (req, file, cb) {
      var newFileName = path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname);
      var fullPath = 'video/' + newFileName;
      cb(null, fullPath);
    }
  }),
  limits: { fileSize: 10000000 } // In bytes: 2000000 bytes = 2 MB
}).single('file');


app.post('/upload-image', (req, res) => {
  imgUpload(req, res, (error) => {
    if (error) {
      console.log('errors', error);
      return res.send({ error: error });
    } else {
      if (req.file === undefined) {
        console.log('Error: No File Selected!');
        return res.send("No hay archivo seleccionado");
      } else {
        //res.cookie('filename', req.file.);
        console.log("success");
        return res.status(200).send(req.file);
      }
    }
  });
});


app.post('/upload-audio', (req, res) => {
  audioUpload(req, res, (error) => {
    if (error) {
      console.log('errors', error);
      return res.send({ error: error });
    } else {
      if (req.file === undefined) {
        console.log('Error: No File Selected!');
        return res.send("No hay archivo seleccionado");
      } else {
        //res.cookie('filename', req.file.);
        console.log("success");
        return res.status(200).send(req.file);
      }
    }
  });
});

app.post('/upload-video', (req, res) => {
  videoUpload(req, res, (error) => {
    if (error) {
      console.log('errors', error);
      return res.send({ error: error });
    } else {
      if (req.file === undefined) {
        console.log('Error: No File Selected!');
        return res.send("No hay archivo seleccionado");
      } else {
        //res.cookie('filename', req.file.);
        console.log("success");
        return res.status(200).send(req.file);
      }
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
/*
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/


module.exports = app;
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => console.log("Escuchando..." + port));