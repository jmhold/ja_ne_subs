'use strict';

angular.module('jaNeSubsApp')
  .config(function ($stateProvider) {
    $stateProvider
        .state('episode', {
          abstract: true,
          url: '/episode',
          template: '<ui-view/>'
        })
      .state('episode.detail', {
        url: '/:id',
        templateUrl: 'app/episode/episode.html',
        controller: 'EpisodeCtrl'
      });
  });