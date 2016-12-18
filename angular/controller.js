var myApp = angular.module('myApp',['ngCookies']);

// myApp.run(function($rootScope){
//   console.log($rootScope.userLogin);
//   //$rootScope.userLogin = null;
// });
myApp.factory('headerInterceptor',['$cookies',function($cookies){
  return {
    request: function(config){
      var token = $cookies.get('token');
      if(token){
        config.headers['token'] = token;
      }
      return config;
    }
  }
}]);

myApp.config(['$httpProvider', function($httpProvider){
  $httpProvider.interceptors.push('headerInterceptor');
}]);
myApp.controller('Register', function($http,$scope){
  $scope.user = {
        username: '',
        password: '',
        email: ''
  };
  $scope.register = function(){
    console.log($scope.user);
    $http.post('/users/register',$scope.user).then(function(result){
      console.log(result.data);
      if(result.data.success){
        window.alert('Register success!');
      }
      else window.alert('Register failed!');
    });
  }
});

myApp.controller('Login', function($http,$scope,$rootScope,$cookies){
  $scope.user = {
        username: '',
        password: ''
  };
  $scope.login = function(){
    $http.post('/users/login',$scope.user).then(function(result){
      if(result.data.success==true){
        $rootScope.userLogin = result.data.data.username;
        var day = new Date();
        day.setDate(day.getDay()+30);
        $cookies.put('token',result.data.token,{expires:day});
        window.alert('Login success!');
      }
      else window.alert('Login failed!');
    });
  }
});

myApp.controller('Test',function($http,$scope,$rootScope){
  $scope.gateways = [];


  $scope.addGateway = function(){
    console.log('test');
    $http.post('/users/getgateways').then(function(result){
      console.log(result.data);
      $scope.gateways = result.data.data.gateways;
    });
  }
});

myApp.controller('ListGateway',function($http,$scope,$rootScope){
  $rootScope.gateways = [];
  $http.post('/users/getgateways').then(function(result){
    $rootScope.gateways = result.data.data.gateways;
  });

  $scope.editGateway = function(gw){
    $rootScope.gwEdit = gw;
  }
  $scope.deleteGateway = function(gw){
    $rootScope.gwDelete = gw;
  }
});

myApp.controller('AddGateway',function($http,$scope,$rootScope){
  $scope.gw = {
    G_MAC: '',
    key: '',
    name: ''
  }
  $scope.addGateway = function(){
    console.log('addGateway');
    $http.post('/users/addgateway',$scope.gw).then(function(result){
      $rootScope.gateways = result.data.data.gateways;
    });
  }
});

myApp.controller('EditGateway',function($http,$scope,$rootScope){
  $scope.editGateway = function(){
    $http.post('/users/editgateway',$rootScope.gwEdit).then(function(result){
      $scope.gateways = result.data.data.gateways;
    });
  }
});

myApp.controller('DeleteGateway',function($http,$scope,$rootScope){
  $scope.deleteGateway = function(){
    $http.post('/users/deletegateway',$rootScope.gwDelete).then(function(result){
      $scope.gateways = result.data.data.gateways;
      location.reload();
    });
  }
});

myApp.controller('ListNode',function($http,$scope,$rootScope){
  $rootScope.curGw = {
    G_MAC: ((window.location.href).split('=')).pop()
  }
  $rootScope.nodes = [];
  $http.post('/users/getnodes',$rootScope.curGw).then(function(result){
    $rootScope.nodes = result.data.data.nodes;
  });

  $scope.editNode = function(node){
    $rootScope.nodeEdit = node;
  }
  $scope.deleteNode = function(node){
    $rootScope.nodeDelete = node;
  }
});

myApp.controller('AddNode',function($http,$scope,$rootScope){
  $scope.node = {
    N_MAC: '',
    key: '',
    name: ''
  }
  $scope.addNode = function(){
    $scope.node.G_MAC = $rootScope.curGw.G_MAC;
    $http.post('/users/addnode',$scope.node).then(function(result){
      $rootScope.nodes = result.data.data.nodes;
    });
  }
});

myApp.controller('EditNode',function($http,$scope,$rootScope){
  $scope.editNode = function(){
    $scope.nodeEdit.G_MAC = $rootScope.curGw.G_MAC;
    $http.post('/users/editnode',$scope.nodeEdit).then(function(result){
      $rootScope.nodes = result.data.data.nodes;
    });
  }
});

myApp.controller('DeleteNode',function($http,$scope,$rootScope){
  $scope.deleteNode = function(){
    $scope.nodeDelete.G_MAC = $rootScope.curGw.G_MAC;
    $http.post('/users/deletenode',$scope.nodeDelete).then(function(result){
      $rootScope.nodes = result.data.data.nodes;
      location.reload();
    });
  }
});

myApp.controller('Device', function($http,$scope,$rootScope,$location){
  // var processData = function(msg){
  //   $scope.nodeData = msg;
  //   for(i=0;i<$scope.nodeData.length;i++){
  //     if($scope.nodeData.data.devices[i].status=='on'){
  //       $scope.nodeData.data.devices[i].sttImg = ''
  //     }
  //   }
  // }
  $scope.nodeData = {};
  $scope.deviceEdit = $scope.deviceAdd = {
    port: '',
    type: '',
    name: '',
    button: ''
  }
  var a = ((window.location.href).split('?')).pop();
  a = a.split('&');
  $scope.topic = a[0].split('=').pop()+'/'+a[1].split('=').pop();
  var client = new Paho.MQTT.Client('test.mosquitto.org', Number(8080), 'smoiotlab');
  client.onMessageArrived = function(message){
    console.log('onMessageArrived');
    var data = JSON.parse(message.payloadString);
    if(data.success){
      $scope.nodeData = data;
    }
    $scope.$apply();
  }
  client.connect({
    onSuccess: function(){
      console.log("onConnect");
      client.subscribe($scope.topic+'/g');
      var dataSend = {
        request: 'getData'
      }
      var message = new Paho.MQTT.Message(JSON.stringify(dataSend));
      message.destinationName = $scope.topic;
      client.send(message);
    }
  });
  $scope.control = function(device){
    var dataSend = {
      request: 'controlDevice',
      data: {
        port: device.port,
        status: (device.status=='on')?'off':'on'
      }
    }
    var message = new Paho.MQTT.Message(JSON.stringify(dataSend));
    message.destinationName = $scope.topic;
    client.send(message);
  }
  $scope.changeMode = function(device){
    var dataSend = {
      request: 'changeMode',
      data: {
        port: device.port,
        mode: (device.mode=='manual')?'auto':'manual'
      }
    }
    var message = new Paho.MQTT.Message(JSON.stringify(dataSend));
    message.destinationName = $scope.topic;
    client.send(message);
  }
  $scope.addDevice = function(){
    var dataSend = {
      request: 'addDevice',
      data: {
        port: $scope.deviceAdd.port,
        type: $scope.deviceAdd.type,
        name: $scope.deviceAdd.name,
        button: $scope.deviceAdd.button
      }
    }
    var message = new Paho.MQTT.Message(JSON.stringify(dataSend));
    message.destinationName = $scope.topic;
    client.send(message);
  }
  $scope.editDevice = function(device){
    $scope.deviceEdit = device;
  }
  $scope.edit = function(){
    var dataSend = {
      request: 'editDevice',
      data: {
        port: $scope.deviceEdit.port,
        type: $scope.deviceEdit.type,
        name: $scope.deviceEdit.name,
        button: $scope.deviceEdit.button
      }
    }
    var message = new Paho.MQTT.Message(JSON.stringify(dataSend));
    message.destinationName = $scope.topic;
    client.send(message);
  }
  $scope.deleteDevice = function(device){
    var dataSend = {
      request: 'deleteDevice',
      data: {
        port: device.port
      }
    }
    var message = new Paho.MQTT.Message(JSON.stringify(dataSend));
    message.destinationName = $scope.topic;
    client.send(message);
  }
  $scope.turnOffAll = function(){
    var dataSend = {
      request: 'turnOffAll'
    }
    var message = new Paho.MQTT.Message(JSON.stringify(dataSend));
    message.destinationName = $scope.topic;
    client.send(message);
  }
  $scope.controlAir = function(device){
    var dataSend = {
      request: 'controlAir',
      data: {
        port: device.port,
        temp: device.temp
      }
    }
    var message = new Paho.MQTT.Message(JSON.stringify(dataSend));
    message.destinationName = $scope.topic;
    client.send(message);
  }

  $scope.controlAuto = function(device){
    var dataSend = {
      request: 'controlAuto',
      data: {
        port: device.port,
        time: device.time
      }
    }
    var message = new Paho.MQTT.Message(JSON.stringify(dataSend));
    message.destinationName = $scope.topic;
    client.send(message);
  }

});
