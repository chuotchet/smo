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

module.exports = router;
