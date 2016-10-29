"use strict";

module.exports = function(sequelize, DataTypes) {
  var Device = sequelize.define('Device', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    button: {
      type: DataTypes.STRING,
      allowNull: true
    },
    port: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enable: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      getDeviceByName: function(name, callback){
        var query = {
          where: {
            name: name
          }
        };
        Device.findOne(query).then(callback);
      }
      // associate: function(models){
      //   User.belongsToMany(models.Course, {through: models.Feedback});
      // }
    },
    tableName: 'device'
  });
  return Device;
};
