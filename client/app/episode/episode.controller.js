'use strict';

angular.module('jaNeSubsApp')
  .controller('EpisodeCtrl', function ($scope, $http, $stateParams) {

    $http.get('/api/episodes/'+$stateParams.id).success(function(episode) {
      $scope.episode = episode;
    });
  });
