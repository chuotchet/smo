var serv = angular.module('serv',[]);
// serv.service('GetGateways',['$http','$q',function($http,$q){
//     this.getGateways = function(){
//       var deferred = $q.defer();
//       return $http.post('/users/getgateways').then(function(result) {
//           var coursesList = result.data.course;
//           for (var i = 0; i < coursesList.length; i++) {
//               coursesList[i].trainerID = JSON.parse(coursesList[i].trainerID);
//               coursesList[i].trainerIDJSON = coursesList[i].trainerID;
//               var trainers = coursesList[i].trainerID[0].text;
//               for (var j = 1; j < coursesList[i].trainerID.length; j++) {
//                   trainers = trainers + ' / ' + coursesList[i].trainerID[j].text;
//               }
//               coursesList[i].trainerID = trainers;
//           }
//           deferred.resolve(coursesList);
//           return deferred.promise;
//       });
//     }
// }]);
