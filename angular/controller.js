var myApp = angular.module('myApp',[]);

myApp.run(function($rootScope){
  console.log($rootScope.userLogin);
  //$rootScope.userLogin = null;
});
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

myApp.controller('Login', function($http,$scope,$rootScope){
  $scope.user = {
        username: '',
        password: ''
  };
  $scope.login = function(){
    $http.post('/users/login',$scope.user).then(function(result){
      console.log(result.data);
      if(result.data.success==true){
        $rootScope.userLogin = result.data.data.username;
        //$cookies.put('token',result.data.token);
        $http.defaults.headers.common['token'] = result.data.token;
        window.alert('Login success!');
        $http.post('/users/getgateways').then(function(result){
          console.log(result.data);
          $scope.gateways = result.data.data.gateways;
        });
      }
      else window.alert('Login failed!');
    });
  }
});


myApp.controller('Gateway',function($http,$scope,$rootScope){
  $scope.gateways = [];
  $http.post('/users/getgateways').then(function(result){
    console.log(result.data);
    $scope.gateways = result.data.data.gateways;
  });

  $scope.addGateway = function(gw){
    $http.post('/users/addgateway',gw).then(function(result){
      console.log(result.data);
      $scope.gateways = result.data.data.gateways;
    });
  }
  $scope.editGateway = function(gw){
    $http.post('/users/editgateway',gw).then(function(result){
      console.log(result.data);
      $scope.gateways = result.data.data.gateways;
    });
  }
  $scope.deleteGateway = function(gw){
    $http.post('/users/deletegateway',gw).then(function(result){
      console.log(result.data);
      $scope.gateways = result.data.data.gateways;
    });
  }
});

myApp.controller('Node',function($http,$scope,$rootScope){
  $scope.nodes = [];
  $http.post('/users/getnodes').then(function(result){
    console.log(result.data);
    $scope.nodes = result.data.data.nodes;
  });

  $scope.addGateway = function(node){
    $http.post('/users/addnode',node).then(function(result){
      console.log(result.data);
      $scope.nodes = result.data.data.nodes;
    });
  }
  $scope.editGateway = function(node){
    $http.post('/users/editnode',node).then(function(result){
      console.log(result.data);
      $scope.nodes = result.data.data.nodes;
    });
  }
  $scope.deleteGateway = function(node){
    $http.post('/users/deletenode',node).then(function(result){
      console.log(result.data);
      $scope.nodes = result.data.data.nodes;
    });
  }
});

myApp.controller('MQTTCtrl', function($http,$scope){
  var client = new Paho.MQTT.Client('test.mosquitto.org', Number(8080), 'smoiotlab');
  client.onMessageArrived = function(message){
    console.log(message.payloadString);
  }
  client.connect({
    onSuccess: function(){
      console.log("onConnect");
      client.subscribe("ahihi");
    }
  });
});
