angular
  .module('app.core')
  .config(CoreConfig)
  .run(CoreRun);

function CoreConfig($compileProvider) {
  // var config = {
  //   apiKey: "",
  //   authDomain: "",
  //   databaseURL: "",
  //   storageBucket: "",
  //   messagingSenderId: ""
  // };
  //firebase.initializeApp(config);

  $compileProvider.debugInfoEnabled(false);
}

function CoreRun($transitions, $state) {

}
