var express = require('express');
var router = express.Router();
var passport = require('passport');
var models = require('../models');
var jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
models.User.sync({
  force: true
});

router.post('/register', function(req, res){
  var newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };
  models.User.getUserByUsename(newUser.username, function(user){
    if(user){
      res.json({
        success: false,
        data: {
          message: 'Register failed!'
        },
        error: 'Username has already exist'
      });
    }
    else{
      models.User.createUser(newUser);
      res.json({
        success: true,
        data: {
          message: 'Register success!',
          username: newUser.username
        }
      });
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
      models.User.comparePassword(req.body.password, user.password, function(isMatch){
        if (isMatch){
          var usr = {
            username: user.username,
            email: user.email
          }
          var token = jwt.sign(usr,'conChuot',{expiresIn:30000});
          res.json({
            success: true,
            data: {
              message: 'Login success!',
              username: user.username
            },
            token: token
          });
        }
        else res.json({
          success: false,
          data: {
            message: 'Login failed!'
          },
          error: 'Wrong password'
        });
      });
    }
    else res.json({
      success: false,
      data: {
        message: 'Login failed!'
      },
      error: 'Username invalid'
    });
  });
});

module.exports = router;
