'use strict';

angular.module('jaNeSubsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('anime', {
        abstract: true,
        url: '/anime',
        template: '<ui-view/>'
      })
      .state('anime.list', {
        url: '/list',
        templateUrl: 'app/anime/anime.list.html',
        controller: 'AnimeListCtrl'
      })
      .state('anime.detail', {
        url: '/:id',
        templateUrl: 'app/anime/anime.detail.html',
        controller: 'AnimeCtrl'
      });
  });