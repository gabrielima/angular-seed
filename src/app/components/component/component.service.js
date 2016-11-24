angular
  .module('app.components')
  .service('ComponentService', ComponentService);

function ComponentService($firebaseArray, $firebaseObject) {
  this.fetch = function() {
    return ' Component';
  };
}

