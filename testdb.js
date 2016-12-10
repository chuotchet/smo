var models = require("./models");

models.Gateway.getGatewayByMAC('qwe', function(gw){
  console.log(gw.dataValues);
});
