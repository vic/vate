angular.module('vate', [])
  .service('VateService', VateService)
  .directive('vateProcessing', ProcessingDirective)
  .controller('VateCtrl', VateCtrl);

function VateService () {
  return {

  };
}

function VateCtrl ($scope) {
  $scope.hello = "Processing";
}

function ProcessingDirective ($http) {

  function link ($scope, el, attrs) {

    var iface = {
      getHello: function () {
        return $scope.hello;
      },
      puts: function () {
        console.log.apply(console, arguments);
      }
    };

    $http.get(attrs.vateProcessing).then(function (resp) {
        $scope.processing = new Processing(el.get(0), resp.data, iface);
    });
  }

  return {
    restrict: 'A',
    link: link 
  }
}