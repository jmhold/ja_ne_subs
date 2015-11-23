'use strict';

angular.module('jaNeSubsApp')
  .controller('AnimeCtrl', function ($scope, $http, $stateParams) {
    $http.get('/api/animes/'+$stateParams.id).success(function(anime) {
        $scope.anime = anime;
    });

    $scope.epOrderBy = function(ep){
        if(parseInt(ep.episode)){
            return parseInt(ep.episode)
        }else{
            return $scope.anime.length;
        }
    }
  });
