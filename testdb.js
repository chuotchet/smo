var models = require("./models");

models.Gateway.getGatewayByMAC('ahihi', function(gw){
  console.log(gw.key);
});
var data = {
  N_MAC: 'dfd',
  key: 'dd',
  name: 'dd'
}
//models.sequelize.sync();
//models.Gateway.sync();
//models.Node.create(data);
// models.Node.getNodeByMAC('0013a20040ac1aed', function(node){
//   console.log(node.dataValues);
// });
