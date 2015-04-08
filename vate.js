angular.module('vate', [])
  .directive('vateP5', P5Directive)
  .controller('VateCtrl', VateCtrl);

function VateCtrl ($scope) {
  $scope.word = "Poesía";
}


function sketch ($scope) {
  return function ($p) {

    var fontSize = 32;
    var radius = 100;
    var center;
    var bgImage;
    var color;
    var word;
    var chars;
    var charsCoords;
    var syllables;
    var syllableColors;

    $p.setup = function setup() {
      $p.resizeCanvas(400, 400);
      $p.background(255);
      $p.loadImage("dragonbebe.png", function(img) {
        bgImage = img;
      });
    }

    function setCharsCoords () {
      charsCoords = {};

      var angle = 360 / chars.length;

      _.forEach(chars, function(chr, idx) {
        var x = (Math.cos(angle * idx * (Math.PI / 180)) * radius)
        var y = (Math.sin(angle * idx * (Math.PI / 180)) * radius)

        charsCoords[chr] = {x: x + center.x, y: y + center.y}
      })
    }

    function charCenterCoords(chr) {
      var coord = charsCoords[chr]
      var x = coord.x + (fontSize * 0.30)
      var y = coord.y - (fontSize * 0.30) 
      return {x: x, y: y};
    }

    function drawClock () {
      $p.stroke(0)
      $p.fill(255)

      _.forEach(charsCoords, function (coords, chr) {
        $p.textSize(fontSize)
        $p.text(chr, coords.x, coords.y)
      })

      _.forEach(syllables, function (syllable, idx) {
        $p.strokeWeight(4);
        $p.stroke.apply($p, syllableColors[syllable]);
        $p.text(syllable, $p.width * 0.05, $p.height * 0.10 + (fontSize * 1.4 * idx))
      });



      $p.beginShape()
      $p.noStroke();
      $p.fill.apply($p, color);
      _.forEach(syllables, function (syllable, idx) {

        var chars = syllable.split('');
        _.forEach(chars, function (chr, cdx) {
          var coords = charCenterCoords(chr);
          $p.curveVertex(coords.x, coords.y);
        })

      });
      $p.endShape($p.CLOSE);

    }

    $p.mouseReleased = function () {
      word = null;
    }


    $p.draw = function draw() {
      if (bgImage) {
        $p.image(bgImage, 0, 0);
      }

      center = {x: $p.width * 0.50, y: $p.height * 0.50};

      var newWord = ($scope.word + "").split(/\s/)[0]
      if (word === newWord) {
        return drawClock();
      }

      word = newWord;
      chars = _.shuffle(_.uniq(word.split('')))
      setCharsCoords();

      color = [_.random(255), _.random(255), _.random(255), 100]

      syllables = Silabas(word).syllables();
      syllableColors = {}
      _.forEach(syllables, function (syllable) {
        syllableColors[syllable] = [_.random(255), _.random(255), _.random(255), 100]
      });

      drawClock(); 
    }
  }
}

function P5Directive () {
  return {
    restrict: 'A',
    link: function ($scope, el, attrs) {
      new p5(sketch($scope), el.get(0)) 
    }
  }
}
