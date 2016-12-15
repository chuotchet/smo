var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('passport');

var authenticate = function(){
  return passport.authenticate('jwt', {session: false});
}
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
  res.render('index');
});

router.get('/test',authenticate(), function(req, res, next) {
  res.render('test');
});

router.get('/gateways',authenticate(), function(req, res, next) {
  res.render('gateway');
});

router.get('/nodes',authenticate(), function(req, res, next) {
  res.render('node');
});

router.get('/devices',authenticate(), function(req, res, next) {
  res.render('devices');
});

router.get('/guide', function(req, res, next) {
  res.render('tour');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});

router.post('/gateway', function(req, res){
  var data = {
    G_MAC: req.body.G_MAC,
    key: req.body.key
  }
  console.log(data);
  models.Gateway.getGatewayByMAC(req.body.G_MAC, function(gw){
    if (!gw){
      models.Gateway.create(data);
      res.send('key added!');
    }
    else {
      gw.key = req.body.key;
      gw.save().then(function(){
        res.send('key changed!');
      });
    }
  });
});

router.post('/node', function(req, res){
  var data = {
    N_MAC: req.body.MAC,
    key: req.body.key
  }
  models.Node.create(data);
  res.send('added node');
});

module.exports = router;
