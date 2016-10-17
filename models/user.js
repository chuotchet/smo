"use strict";
var bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      createUser: function(newUser){
        bcrypt.genSalt(10, function(err,salt){
          bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;
            User.create(newUser);
          });
        });
      },
      getUserByUsename: function(username, callback){
        var query = {
          where: {
            username: username
          }
        };
        User.findOne(query).then(callback);
      },
      comparePassword: function(password, hashed, callback){
        bcrypt.compare(password, hashed, function(err, isMatch){
          if(err) throw err;
          callback(isMatch);
        });
      },
      associate: function(models){
        User.belongsToMany(models.Gateway, {through: 'UserGateways'});
      }
    },
    tableName: 'user'
  });
  return User;
};
