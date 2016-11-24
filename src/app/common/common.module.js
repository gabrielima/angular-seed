angular
  .module('app.common', [
    'app.core',
    'templates'
  ])
  .config(CommonConfig);

function CommonConfig($stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
  var state = {
    name: '404',
    url: '/404',
    templateUrl: './404.html',
  };

  $stateProvider.state(state);

  $urlRouterProvider
    .when('', '/')
    .when('/', '/component')
    .otherwise('/404');
}