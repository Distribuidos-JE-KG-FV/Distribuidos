var express = require('express');
var router = express.Router();
var aws="/conversion";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('conversion', { title: 'Conversion'});
});


router.post('/image', function(req,res,next){
    //AQUI VA LA MAGIA
    res.render('conversion_wait', { title: 'Espera...', text:'La imagen está siendo procesada'});
})

router.post('/audio', function(req,res,next){
    //AQUI VA LA MAGIA
    res.render('conversion_wait', { title: 'Espera...', text:'El audio está siendo procesado'});
})

router.post('/video', function(req,res,next){
    //AQUI VA LA MAGIA
    res.render('conversion_wait', { title: 'Espera...', text:'El video está siendo procesado'});
})




module.exports = router;
