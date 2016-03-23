// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'highcharts-ng'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.controller("HomeController", function($scope) {
  var vm = this,
    tempX,
    tempY;
  vm.velocity = [],
    vm.globalPlotter = [],
    vm.particle = [];
  var gbest,
    tempFitness = 0.0;

  function make2DecimalPlace(val) {
    return +(val.toFixed(4));
  }

  function getRandomArbitrary(min, max) {
    var x = +((Math.random() * (max - min) + min).toFixed(4));
    return x < 0 ? x * -1 : x;
  }


  vm.calculate = function() {
    vm.globalPlotter = [];
    for (var j = 0; j < 20; j++) {
      vm.velocity = [];
      vm.particle = [];
      gbest = {
        val: 0.0,
        x: 0,
        y: 0
      };
      for (var i = 0; i < 20; i++) {
        tempX = getRandomArbitrary(-2, 2)
        tempY = getRandomArbitrary(-5, 5)
        vm.velocity.push({
          x: tempX,
          y: tempY
        });
        tempFitness = make2DecimalPlace(Math.pow(vm.velocity[i].x, 2) + Math.pow(vm.velocity[i].y, 2));
        if (tempFitness > gbest.val) {
          gbest.val = tempFitness;
          gbest.x = vm.velocity[i].x;
          gbest.y = vm.velocity[i].y;
        }
        vm.particle.push({
          fitness: tempFitness,
          velocity: {
            x: 0.0,
            y: 0.0
          },
          lbest: tempFitness,
          present: {
            x: 0,
            y: 0
          }
        })
      }

      for (var i = 0; i < 20; i++) {
        var tempVX = make2DecimalPlace(2 * getRandomArbitrary(0, 1) * (gbest.x - vm.particle[i].present.x) + (vm.particle[i].lbest - vm.particle[i].present.x));
        var tempVY = make2DecimalPlace(2 * getRandomArbitrary(0, 1) * (gbest.y - vm.particle[i].present.y) + (vm.particle[i].lbest - vm.particle[i].present.y));
        vm.particle[i].velocity.x = tempVX;
        vm.particle[i].velocity.y = tempVY;
        vm.particle[i].present.x += tempVX;
        vm.particle[i].present.y += tempVY;
        vm.particle[i].fitness = make2DecimalPlace(Math.pow(vm.particle[i].velocity.x, 2) + Math.pow(vm.particle[i].velocity.y, 2));

        if (vm.particle[i].fitness > vm.particle[i].lbest) {
          vm.particle[i].lbest = vm.particle[i].fitness
        }
        if (vm.particle[i].fitness > gbest.val) {
          gbest.val = vm.particle[i].fitness;
          gbest.x = vm.particle[i].velocity.x;
          gbest.y = vm.particle[i].velocity.y;
        }
      }
      vm.globalPlotter.push(gbest.val);
      // console.log("vm.velocity", vm.velocity);
      // console.log("vm.particle", vm.particle);
      // console.log("gbest", gbest);
    }
    // console.log("Global List:", vm.globalPlotter);
    $scope.chart.series[1].data = [];
    for (var i = 0; i < vm.globalPlotter.length; i++) {
      vm.globalPlotter[i] = vm.globalPlotter[i] / 10000;
      $scope.chart.series[1].data.push(vm.particle[i].fitness / 100);
      console.log("Divident", vm.particle[i].fitness / 100);
    }
    // console.log("Global List After:", vm.globalPlotter);
    $scope.chart.series[0].data = vm.globalPlotter;
  }

  $scope.chart = {
    options: {
      chart: {
        type: 'line'
      },
      legend: {
        enabled: false
      }
    },
    title: {
      text: "Particle Swarm Optimization"
    },
    yAxis: {
      title: "Global Maxima",
      min: 0,
      max: 100000,
      tickPixelInterval: 30,
      tickLength: 0
    },
    xAxis: {
      type: 'linear',
      min: 0,
      max: 20,
      // tickLength: 1,
      tickPixelInterval: 100
    },
    series: [{
      name: "Global Best",
      data: vm.globalPlotter
        // data: [15,26,34,47,54,6,73,8,96,0,233,32,32,31,3]
    }, {
      name: "Gene Fitness",
      data: []
    }]
  };


})
