angular.module('starter.controllers', [])

  .controller('DashCtrl', function($scope, $ionicPlatform, $cordovaLocalNotification, $cordovaGeolocation, $cordovaBluetoothSerial, $interval, $ionicLoading, $timeout, $cordovaDeviceMotion, $rootScope) {
    $ionicPlatform.ready(function() {
    $scope.lastSyncArduino = "Never";
    $scope.lastSyncServer = "Never";
    $scope.dateTime = (new Date).getTime();
    $scope.lat = 0;
    $scope.lng = 0;
    $scope.distance = 0;

    var watchOptions = {
      timeout : 5000,
      maximumAge: 1000,
      enableHighAccuracy: true // may cause errors if true
    };

    var lastPos = null;
    var pollCurrentLocation = function() {
      $cordovaGeolocation.getCurrentPosition(watchOptions)
        .then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;

          $scope.lat = lat;
          $scope.lng = long;

          if(lastPos == null) {
            lastPos = position;
          }
          var distance = calculateDistance(lastPos.coords.latitude, lastPos.coords.longitude, position.coords.latitude, position.coords.longitude);
          if(lastPos != position) {
            $scope.distance = distance*1000;
            lastPos = position;
          }
        }, function(err) {
          $scope.lat = "Attente GPS ...";
          $scope.lng = err;
        });
      $scope.dateTime = (new Date).getTime();
      setTimeout(pollCurrentLocation, 1000);
    };

    function calculateDistance(lat1, lon1, lat2, lon2) {
      var R = 6371; // km
      var dLat = (lat2 - lat1).toRad();
      var dLon = (lon2 - lon1).toRad();
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
    }
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }

    /*var lastpos = null;
    var pollCurrentLocation = function () {
      $cordovaGeolocation.watchPosition(function(position) {
          if(lastpos == null) {
            lastpos = position;
          }
          var distance = calculateDistance(lastpos.coords.latitude, lastpos.coords.longitude, position.coords.latitude, position.coords.longitude);
          console.log(distance);
          $scope.distance = distance;
      },function(){
        console.log("GPS ERROR");
      },{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
    };*/

    $scope.devices = null;
    $scope.listBluetoothDevices = function() {
      $scope.updateSingleNotification = function () {
        $cordovaLocalNotification.update({
          id: 1,
          title: 'Green Path',
          text: 'Status: Bluetooth désactivé.'
        })
      };
      $scope.bluetooth_label = "Scanning...";

      $ionicLoading.show({
        content: 'Scanning...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      bluetoothSerial.isEnabled(
        bluetoothSerial.discoverUnpaired(
          function (unpaired_devices) {
            $timeout(function () {
              $scope.devices = unpaired_devices;
              angular.forEach(unpaired_devices, function (device) {
                console.log(device);
              });
              $scope.bluetooth_label = "Done.";
              $ionicLoading.hide();
            });
          },
          function () {
            console.log("Bluetooth error.");
          })
      , function(){
        $scope.bluetooth_label = "Bluetooth désactivé.";
        $ionicLoading.hide();
        console.log("Bluetooth error.");
      });
    }
      $scope.scheduleSingleNotification = function () {
        $cordovaLocalNotification.schedule({
          id: 1,
          title: 'Green Path',
          text: 'Status: Déconnecté.'
        });
      };

      $rootScope.$on('$cordovaLocalNotification:clear',
        function (event, notification, state) {
          $cordovaLocalNotification.schedule({
            id: 1,
            title: 'Green Path',
            text: 'Status: Déconnecté.'
          });
        });
     pollCurrentLocation();
    });

  })
  .controller('DatasCtrl', function($scope, Datas) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.datas = Datas.all();
    $scope.remove = function(data) {
      Datas.remove(data);
    };
  })

  .controller('DataDetailCtrl', function($scope, $stateParams, Datas) {
    $scope.data = Datas.get($stateParams.dataId);
  })

  .controller('SettingsCtrl', function($scope) {
    $scope.settings = {
      enableDebugMode: true
    };
  });
