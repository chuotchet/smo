var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var models = require('../models');
var jwt = require('jsonwebtoken');
var opts = {
  secretOrKey: 'hihihehe',
  jwtFromRequest: ExtractJwt.fromBodyField('token')
}

passport.use(new Strategy(opts, function(jwt_payload, done){
  return done(null, jwt_payload);
}));

var authenticate = function(){
  return passport.authenticate('jwt', {session: false});
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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

router.post('/token', authenticate(), function(req,res){
  models.User.getUserByUsename(req.user.username, function(user){
    models.Gateway.getGatewayByMAC('qwerty', function(gw){
      user.addGateway(gw);
    });
  });
  res.send('ok');
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
          var token = jwt.sign(usr,'hihihehe',{expiresIn:30000});
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

router.post('/getgateways', authenticate(), function(req, res){
  models.User.getUserByUsename(req.user.username, function(user){
    user.getGateways().then(function(gw){
      res.json({
        success: true,
        data: gw,
        error: ''
      });
    });
  });
});

router.post('/addgateway', authenticate(), function(req, res){
  models.Gateway.getGatewayByMAC(req.body.G_MAC, function(gw){
    if (gw.key!=req.body.key){
      res.send('Key is not correct!');
    }
    else {
      gw.name = req.body.name;
      gw.save().then(function(){
        models.User.getUserByUsename(req.user.username, function(user){
          user.addGateway(gw).then(function(){
            user.getGateways().then(function(gtw){
              res.json({
                success: true,
                data: gtw,
                error: ''
              });
            });
          });
        });
      });
    }
  });
});

router.post('/editgateway', authenticate(), function(req, res){
  models.User.getUserByUsename(req.user.username, function(user){
    models.Gateway.getGatewayByMAC(req.body.G_MAC, function(gw){
      user.hasGateway(gw).then(function(isAsscociated){
        if(!isAsscociated){
          res.send('User does not have this gateway yet!');
        }
        else {
          gw.name = req.body.name;
          gw.save().then(function(){
            user.getGateways().then(function(gtw){
              res.json({
                success: true,
                data: gtw,
                error: ''
              });
            });
          });
        }
      });
    });
  });
});

router.post('/deletegateway', authenticate(), function(req, res){
  models.User.getUserByUsename(req.user.username, function(user){
    models.Gateway.getGatewayByMAC(req.body.G_MAC, function(gw){
      if(gw.key!=req.body.key){
        res.send('Key is not correct!');
      }
      else{
        user.removeGateway(gw).then(function(){
          user.getGateways().then(function(gtw){
            res.json({
              success: true,
              data: gtw,
              error: ''
            });
          });
        });
      }
    });
  });
});
module.exports = router;
