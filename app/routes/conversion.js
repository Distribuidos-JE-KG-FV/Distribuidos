var express = require('express');
var router = express.Router();
var aws="/conversion";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('conversion', { title: 'Conversion'});
});

//const fs = require('fs');
const AWS = require('aws-sdk');
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
const url = require('url');
const s3 = new AWS.S3({
    accessKeyId: "AKIAURD34BBPNXNKR7F6",
    secretAccessKey:"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" 
});


const profileImgUpload = multer({
    storage: multerS3({
     s3: s3,
     bucket: 'bucket-dist-receptor',
     acl: 'public-read',
     key: function (req, file, cb) {
      cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
     }
    }),
    limits:{ fileSize: 50000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
     checkFileType( file, cb );
    }
   }).single('upload');

function checkFileType( file, cb ){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    const mimetype = filetypes.test( file.mimetype );
    if( mimetype && extname ){
        return cb( null, true );
    } else {
        cb( 'Error: Images Only!' );
    }
}

/*function retrieveFile(filename,res){

    const getParams = {
      Bucket: 'sample-bucket-name',
      Key: filename
    };
  
    s3.getObject(getParams, function(err, data) {
      if (err){
        return res.status(400).send({success:false,err:err});
      }
      else{
        return res.send(data.Body);
      }
    });
}*/

router.post( '/image', function(req,res,next){
    profileImgUpload( req, res, ( error ) => {
      if( error ){
       console.log( 'errors', error );
       res.json( { error: error } );
      } else {
       if( req.file === undefined ){
        console.log( 'Error: No File Selected!' );
        res.json( 'Error: No File Selected' );
       } else {
        console.log("success");
        res.render('index');
       }
      }
     });
});


router.post('/audio', function(req,res,next){
    //AQUI VA LA MAGIA
    res.render('conversion_wait', { title: 'Espera...', text:'El audio está siendo procesado'});
})

router.post('/video', function(req,res,next){
    //AQUI VA LA MAGIA
    res.render('conversion_wait', { title: 'Espera...', text:'El video está siendo procesado'});
})

module.exports = router;
