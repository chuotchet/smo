var express = require('express');
var router = express.Router();
var models = require('../models');
// models.User.sync({
//   force: true
// }).then(function(){
//   models.User.create({
//     username: 'hihi',
//     password: 'haha'
//   }).then(function(){
//     console.log('added user!');
//   });
// });
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Smart office' });
});

router.get('/hihi', function(req, res, next) {
  res.send('hihi');
});

router.post('/gateway', function(req, res){
  var data = {
    G_MAC: req.body.MAC,
    key: req.body.key
  }
  models.Gateway.getGatewayByMAC(req.body.MAC, function(gw){
    if (!gw){
      models.Gateway.create(data);
      res.send('key added!');
    }
    else {
      models.Gateway.update({
        key: req.body.key
      }, {
        where: {
          G_MAC: req.body.MAC
        }
      }).then(function(){
        res.send('key changed!');
      });
    }
  });
});

module.exports = router;
