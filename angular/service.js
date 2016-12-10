var myApp = angular.module('myApp',[ngCookies]);
myApp.run(function($rootScope,$cookies){
  var token = $cookies.get('token');
  if(token){
    $rootScope.token = token;
  }
});
myApp.factory('setHeader',[$rootScope, function($rootScope){
  return {
    request: function($config){
      if ($rootScope.token){
        //$config.headers
      }
    }
  }
}]);
