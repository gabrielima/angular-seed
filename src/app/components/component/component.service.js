angular
  .module('app.components')
  .service('ComponentService', ComponentService);

function ComponentService(API, $firebaseArray, $firebaseObject) {
  this.fetch = function() {
    return 'Component';
  };
}

