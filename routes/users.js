var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var models = require('../models');
var mqtt = require('mqtt');
var jwt = require('jsonwebtoken');
var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['token'];
    }
    console.log(token);
    return token;
};
var opts = {
  secretOrKey: 'hihihehe',
  jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromHeader('token'), cookieExtractor])
}

passport.use(new Strategy(opts, function(jwt_payload, done){
  return done(null, jwt_payload);
}));

var authenticate = function(){
  return passport.authenticate('jwt', {session: false});
}

//////////////////////////////////////////////////////////
var crypto = require('crypto');
function nullpad( str, len ) {
    if( str.length >= len ) {
        return str;
    }
    return str + Array( len-str.length + 1 ).join("\x00");
}

var iv = new Buffer(16);
iv.fill(0);
function decrypt(text,password){
  try {
    var decipher = crypto.createDecipheriv('aes-256-cbc', password, iv);
    var dec = decipher.update(text,'base64','utf-8');
    dec += decipher.final('utf8');
    return dec;
  } catch (e) {
    console.log(e);
    return '{"error":"wrong message"}';
  }
}
function encrypt(text,password){
  var cipher = crypto.createCipheriv('aes-256-cbc', password, iv);
  var crypted = cipher.update(text,'utf8','base64')
  crypted += cipher.final('base64');
  return crypted;
}
/////////////////////////////////////////////////////////////////////////

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
          var token = jwt.sign(usr,'hihihehe',{expiresIn:9999999999});
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
        data: {
          gateways: gw
        },
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
                data: {
                  gateways: gtw
                },
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
                data: {
                  gateways: gtw
                },
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
      user.removeGateway(gw).then(function(){
        user.getGateways().then(function(gtw){
          res.json({
            success: true,
            data: {
              gateways: gtw
            },
            error: ''
          });
        });
      });
    });
  });
});

router.post('/getnodes', authenticate(), function(req, res){
  models.Gateway.getGatewayByMAC(req.body.G_MAC, function(gw){
    gw.getNodes().then(function(node){
      res.json({
        success: true,
        data: {
          nodes: node
        }
      });
    });
  });
});

router.post('/addnode', authenticate(), function(req, res){
  models.Gateway.getGatewayByMAC(req.body.G_MAC, function(gw){
    models.Node.getNodeByMAC(req.body.N_MAC, function(node){
      node.name = req.body.name;
      node.save().then(function(){
        gw.addNode(node).then(function(){
          gw.getNodes().then(function(nodes){
            res.json({
              success: true,
              data: {
                nodes: nodes
              }
            });
          });
        });
      });
    });
  });
});

router.post('/editnode', authenticate(), function(req, res){
  models.Gateway.getGatewayByMAC(req.body.G_MAC, function(gw){
    models.Node.getNodeByMAC(req.body.N_MAC, function(node){
      gw.hasNode(node).then(function(isAsscociated){
        if(!isAsscociated){
          res.send('Gateway does not have this node yet!');
        }
        else {
          node.name = req.body.name;
          node.save().then(function(){
            gw.getNodes().then(function(nodes){
              res.json({
                success: true,
                data: {
                  nodes: nodes
                }
              });
            });
          });
        }
      });
    });
  });
});

router.post('/deletenode', authenticate(), function(req, res){
  var client  = mqtt.connect('mqtt://test.mosquitto.org');

  client.on('connect', function () {
    console.log('connected to mqtt');
    client.subscribe(req.body.G_MAC+'/'+req.body.N_MAC+'/s');
    // var message = {
    //   request: 'deleteNode'
    // }
    // console.log(req.body.G_MAC+'/'+req.body.N_MAC);
    // console.log(message);
    // client.publish(req.body.G_MAC+'/'+req.body.N_MAC,JSON.stringify(message))
  });

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    client.end();
  });
  models.Gateway.getGatewayByMAC(req.body.G_MAC, function(gw){
    var key = gw.key;
    var password = nullpad(key,32);
    var message = {
      request: 'deleteNode'
    }
    message = encrypt(JSON.stringify(message),password);
    console.log(req.body.G_MAC+'/'+req.body.N_MAC);
    console.log(message);
    client.publish(req.body.G_MAC+'/'+req.body.N_MAC,message);

    models.Node.getNodeByMAC(req.body.N_MAC, function(node){
      gw.removeNode(node).then(function(){
        gw.getNodes().then(function(nodes){
          res.json({
            success: true,
            data: {
              nodes: nodes
            }
          });
        });
      });
    });
  });
});

module.exports = router;
