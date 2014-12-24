var cTestApp = angular.module('cTestAppNew', []);

cTestApp.controller('cTestController', function() {
  this.ready = false;
  this.test = 'bar';
});

var anotherApp = angular.module('AnotherApp', []);
anotherApp.controller('AnotherController', ['$timeout', function($timeout) {
  this.value = 'Another stuff';
  var self = this;
  $timeout(function() { self.value = 'CHANGED'; }, 3000);
}]);

function JSONModel(name, title) {
  this.name = name;
  this.title = title;
  this.editing = false;
};

anotherApp.service('viewStateService', function() {
  var view_ = 1;
  var params_ = [];
  var contact_ = {};
  var obsFunc_ = null;

  var getParams = function() { return params_; };
  var setViewId = function(view) { view_ = view; };
  var setParams = function(params) { params_ = params; };
  var setContact = function(contact) {
    contact_ = contact
    if (obsFunc_) obsFunc_(contact_);
  };
  var isViewId = function(id) { return view_ === id; };
  var setContactChangeObserver = function(obsFunc) { obsFunc_ = obsFunc; };

  return {
    setViewId: setViewId,
    getParams: getParams,
    setParams: setParams,
    isViewId: isViewId,
    setContact: setContact,
    setContactChangeObserver: setContactChangeObserver 
  };
});

anotherApp.controller('EditTest',
    ['$scope', 'viewStateService', function($scope, viewStateService) {
  var ar = [];
  ar.push(new JSONModel('John', 'Salut'));
  ar.push(new JSONModel('Xander', 'Hello'));
  ar.push(new JSONModel('Tyler', 'Fight'));
  $scope.data = ar;

  $scope.closeEdit = function(idx) {
    window.console.log('closeEdit click on: ' + idx);
    $scope.data[idx].editing = false;
  };
  $scope.openEdit = function(idx) {
    window.console.log('closeEdit click on: ' + idx);
    $scope.data[idx].editing = true;
  };

  var MY_VIEW_ID = 1;
  viewStateService.setViewId(MY_VIEW_ID);

  $scope.isViewCurrentView = function() {
    return viewStateService.isViewId(MY_VIEW_ID);
  };

  $scope.view = 1;
  //$scope.contacts =
  ContactDetail.getDummyData(function(data) {
    $scope.contacts = data;
  });
  $scope.openContact = function(idx) {
    $scope.view = 2;
    viewStateService.setViewId(2);
    viewStateService.setParams([idx]);
    viewStateService.setContact($scope.contacts[idx]);
  };
}]);

anotherApp.controller('SingleContactDetailController',
    ['$scope', 'viewStateService', function($scope, viewStateService) {
  var MY_VIEW_ID = 2;
  viewStateService.setContactChangeObserver(function(contact) {
    $scope.contact = contact;
  });

  $scope.isViewCurrentView = function() {
    return viewStateService.isViewId(MY_VIEW_ID);
  };
  $scope.goBack = function() {
    viewStateService.setViewId(1);
    viewStateService.setParams([]);
  };
}]);

window.onload = function() {
  angular.bootstrap(document.getElementById('another-app'),
                    ['AnotherApp']);
};
