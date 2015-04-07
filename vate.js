angular.module('vate', [])
  .service('VateService', VateService)
  .directive('vateProcessing', ProcessingJSDirective)
  .controller('VateCtrl', VateCtrl);

function VateService () {
  return {

  };
}

function VateCtrl ($scope) {
  $scope.hello = "Procesando";
  $scope.world = "Poesía";
}

function Sketch ($scope, $p)  {

  $p.setup = function () {
    $p.size(630, 360);  
    var f =  $p.createFont("Arial", 24); 
    $p.textFont(f);      
    $p.background(102);
    $p.fill(0);
  }

  $p.draw = function draw () {
    $p.text($scope.hello, $p.width * 0.50, $p.height * 0.50);  
    _.forEach( Silabas($scope.world).syllables(), function (syllable, idx) {
       $p.text(syllable, $p.width * 0.10, $p.height * 0.10 + (idx * 32));
    })
  }

}

function ProcessingJSDirective () {
  return {
    restrict: 'A',
    link: function ($scope, el, attrs) { 
      Processing.disableInit();
      var canvas = el.get(0);
      new Processing(canvas, function (processing) {
        Sketch($scope, processing) 
      });
    }
  };
}
