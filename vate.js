angular.module('vate', [])
  .service('VateService', VateService)
  .directive('vateProcessing', ProcessingDirective)
  .controller('VateCtrl', VateCtrl);

function VateService () {
  return {

  };
}

function VateCtrl ($scope) {
  $scope.hello = "Procesando";
  $scope.world = "Poesía";
}

function ProcessingDirective ($http) {

  function link ($scope, el, attrs) {

    var processing;

    var iface = {
      hello: function () {
        return $scope.hello;
      },
      puts: function () {
        console.log.apply(console, arguments);
      },
      drawWorld: function () {
        _.forEach( Silabas($scope.world).syllables(), function (syllable, idx) {
          processing.text(syllable, processing.width * 0.10, processing.height * 0.10 + (idx * 32));
        })
      }
    };

    $http.get(attrs.vateProcessing).then(function (resp) {
        $scope.processing = processing = new Processing(el.get(0), resp.data, {vate: function () { return iface }});
    });
  }

  return {
    restrict: 'A',
    link: link 
  }
}