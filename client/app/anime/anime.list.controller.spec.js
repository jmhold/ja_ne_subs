'use strict';

describe('Controller: AnimesCtrl', function () {

  // load the controller's module
  beforeEach(module('jaNeSubsApp'));

  var AnimesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnimesCtrl = $controller('AnimesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
