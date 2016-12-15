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
  $scope.nodeData = {};
  var a = ((window.location.href).split('?')).pop();
  a = a.split('&');
  var topic = a[0].split('=').pop()+'/'+a[1].split('=').pop();
  var client = new Paho.MQTT.Client('test.mosquitto.org', Number(8080), 'smoiotlab');
  client.onMessageArrived = function(message){
    // var data = JSON.parse(message.payloadString);
    // if(data.success){
    //   $scope.nodeData = data;
    //   console.log($scope.nodeData);
    // }
    $scope.test = message.payloadString;
  }
  client.connect({
    onSuccess: function(){
      console.log("onConnect");
      client.subscribe(topic+'/g');
    }
  });
});
