'use strict';

angular.module('jaNeSubsApp')
  .controller('AnimeListCtrl', function ($scope, $http) {


      $http.get('/api/animes').success(function(animes) {
        console.log(animes)
        $scope.animes = animes;
      });

  });
