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
  models.User.getUserByUsename(newUser.username, function(user){
    if(user){
      res.send('Username has already exist');
    }
    else{
      models.User.createUser(newUser);
      res.send('OK');
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
  console.log(req.body);
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
          mes: 'ok',
          token: token
        });
      }
      else res.send('not ok');
    }
    else res.send('no user');
  });
});

module.exports = router;
