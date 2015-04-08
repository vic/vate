angular.module('vate', [])
  .service('sketch', SketchService)
  .directive('vateP5', P5Directive)
  .controller('VateCtrl', VateCtrl);

function VateCtrl ($scope) {
  $scope.word = "Poema";
}

function SketchService ($http) {
  return function ($scope) {
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

      var flickrImage, flickrEffect, flickrPages;
      function flickrSearch() {
        flickrEffect = _.sample([$p.BLEND, $p.DARKEST, $p.DIFFERENCE, $p.MULTIPLY, $p.EXCLUSION, $p.SCREEN, $p.REPLACE, $p.OVERLAY, $p.DODGE, $p.BURN, $p.ADD]);
        flickrEffect = $p.MULTIPLY;
        var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&content_type=1&in_gallery=1&safe_search=1&&api_key=d8e63434369d2ab77750623af9c84a22&format=json&nojsoncallback=1&per_page=1&text="
        url += word;
        var page = Math.min(_.random(flickrPages || _.random(10000)), _.random(10000));
        console.log(page);
        url += '&page=' + page;
        $http.get(url).then(function (response) {
          flickrPages = response.data.photos.pages;
          var meta = response.data.photos.photo[0];
          var image_url = "https://farm"+meta.farm+".staticflickr.com/"+meta.server+"/"+meta.id+"_"+meta.secret+".jpg";
          $p.loadImage(image_url, function (img) {
            flickrImage = img;
          })
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
        $p.clear();

        if (bgImage) {
          $p.background(bgImage);
          if (flickrImage) {
            $p.blend(flickrImage, 0, 0, flickrImage.width, flickrImage.height, 0, 0, bgImage.width, bgImage.height, flickrEffect);
          }
        }

        center = {x: $p.width * 0.50, y: $p.height * 0.50};

        var newWord = ($scope.word + "").split(/\s/)[0]
        if (word === newWord) {
          return drawClock();
        }

        word = newWord;

        flickrSearch();

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
}

function P5Directive (sketch) {
  return {
    restrict: 'A',
    link: function ($scope, el, attrs) {
      new p5(sketch($scope), el.get(0)) 
    }
  }
}
