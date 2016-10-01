var express = require('express');
var router = express.Router();
var passport = require('passport');
var models = require('../models');
var jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res){
  var newUser = {
    username: req.body.username,
    password: req.body.password
  };
  var datasend = {
    success: '',
    msg: ''
  };
  models.User.getUserByUsename(newUser.username, function(user){
    if(user){
      datasend.success = 'No';
      datasend.msg = 'Username has already exist';
      res.send(datasend);
    }
    else{
      models.User.createUser(newUser);
      datasend.success = 'Yes';
      res.send(datasend);
    }
  });
});

router.post('/token',function(req,res){
  var token = req.body.token;
  jwt.verify(token,'conChuot',function(err, decoded){
    if(err){
      res.send('failed');
    }
    else{
      res.send(decoded);
    }
  });
});

router.post('/login',function(req, res){
  models.User.findOne({
    where: {
      username: req.body.username
    }
  }).then(function(user){
    if (user){
      if (user.password==req.body.password){
        var usr = {
          username: user.username,
          password: user.password
        }
        var token = jwt.sign(usr,'conChuot',{expiresIn:30000});
        res.json({
          success: 'Yes',
          token: token
        });
      }
      else res.json({
        success: 'No',
        msg: 'Wrong password'
      });
    }
    else res.json({
      success: 'No',
      msg: 'Username invalid'
    });
  });
});

module.exports = router;
