"use strict";

module.exports = function(sequelize, DataTypes) {
  var Node = sequelize.define('Node', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    N_MAC: {
      type: DataTypes.STRING,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      getNodeByMAC: function(MAC, callback){
        var query = {
          where: {
            N_MAC: MAC
          }
        };
        Node.findOne(query).then(callback);
      },
      associate: function(models){
        Node.belongsToMany(models.Device, {through: 'NodeDevices'});
      }
    },
    tableName: 'node'
  });
  return Node;
};
