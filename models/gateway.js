"use strict";

module.exports = function(sequelize, DataTypes) {
  var Gateway = sequelize.define('Gateway', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    G_MAC: {
      type: DataTypes.STRING,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      getGatewayByMAC: function(MAC, callback){
        var query = {
          where: {
            G_MAC: MAC
          }
        };
        Gateway.findOne(query).then(callback);
      }
      // associate: function(models){
      //   User.belongsToMany(models.Course, {through: models.Feedback});
      // }
    },
    tableName: 'gateway'
  });
  return Gateway;
};
