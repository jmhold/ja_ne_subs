'use strict';

describe('Controller: ParsedCtrl', function () {

  // load the controller's module
  beforeEach(module('jaNeSubsApp'));

  var ParsedCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ParsedCtrl = $controller('ParsedCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
