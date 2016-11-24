angular
  .module('app.components')
  .controller('ComponentController', ComponentController);

function ComponentController(ComponentService) {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.data = ComponentService.fetch();
  };
}

