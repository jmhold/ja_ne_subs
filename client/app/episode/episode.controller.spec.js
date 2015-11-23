'use strict';

describe('Controller: EpisodeCtrl', function () {

  // load the controller's module
  beforeEach(module('jaNeSubsApp'));

  var EpisodeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EpisodeCtrl = $controller('EpisodeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
