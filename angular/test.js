var myApp = angular.module('myApp',['ngCookies']);
myApp.controller('TestCtrl', function($http,$scope,$rootScope,$location){
  $scope.nodeData = {};
  $scope.testdata = '';
  // var a = ((window.location.href).split('?')).pop();
  // a = a.split('&');
  // var topic = a[0].split('=').pop()+'/'+a[1].split('=').pop();
  var client = new Paho.MQTT.Client('test.mosquitto.org', Number(8080), 'smoiotlab');
  client.onMessageArrived = function(message){
    console.log('message arrive');
    // var data = JSON.parse(message.payloadString);
    // if(data.success){
    //   $scope.nodeData = data;
    //   console.log($scope.nodeData);
    // }
    $scope.$apply(function(){
      $scope.testdata = message.payloadString;
    });

    console.log($scope.testdata);
  }
  client.connect({
    onSuccess: function(){
      console.log("onConnect");
      client.subscribe('D2-FA-E8/2/g');
    }
  });
});
