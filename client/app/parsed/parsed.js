'use strict';

angular.module('jaNeSubsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('parsed', {
          abstract: true,
          url: '/parsed',
          template: '<ui-view/>'
      })
      .state('parsed.detail', {
        url: '/:id',
        templateUrl: 'app/parsed/parsed.html',
        controller: 'ParsedCtrl'
      });
  });

