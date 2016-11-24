angular
  .module('app.components')
  .component('component', Component())
  .config(ComponentConfig);

function Component() {
  return {
    templateUrl: './component.html',
    controller: 'ComponentController',
    bindings: {}
  };
}

function ComponentConfig($stateProvider) {
  var state = {
    name: 'component',
    url: '/component',
    component: 'component',
    resolve: {}    
  };

  $stateProvider.state(state);
}
