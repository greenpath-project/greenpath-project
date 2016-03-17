var view = require("ui/core/view");
var frameModule = require("ui/frame");
var observable = require("data/observable");
var mapbox = require("nativescript-mapbox");
var dialogs = require("ui/dialogs");

/*exports.loaded = function (args) {
   var page = args.object;
   this.Show;
}*/

exports.Show = function() {
  mapbox.show({
    accessToken: 'pk.eyJ1Ijoic3Bhcmh4IiwiYSI6ImNpaGcwODlpcjAwNzN2a205aXp0bXpncjUifQ.aApDNZOT1Tr6SpvqnOfugg',
    style: mapbox.MapStyle.EMERALD,
    margins: {
      left: 0,
      right: 0,
      top: 100,
      bottom: 50
    },
    center: {
      lat: 44.865251,
      lng: -0.560667,
    },
    zoomLevel: 15, // 0 (most of the world) to 20, default 0
    showUserLocation: true, // default false
    hideAttribution: true, // default false
    hideLogo: true, // default false
    hideCompass: false, // default false
    disableRotation: false, // default false
    disableScroll: false, // default false
    disableZoom: false, // default false
    disableTilt: false, // default false
    markers: [{
      lat: 44.865251,
      lng: -0.560667,
      title: 'EPSI Bordeaux'
    }]
  }).then(
    function(result) {
      console.log("Mapbox show done");
    },
    function(error) {
      console.log("mapbox show error: " + error);
    }
  );
};

Hide = function() {
  mapbox.hide().then(
    function(result) {
      console.log("Mapbox hide done");
    },
    function(error) {
      console.log("mapbox hide error: " + error);
    }
  );
};

AddMarkers = function() {
  mapbox.addMarkers([{
    lat: 52.3602160,
    lng: 4.8891680,
    title: 'One-line title here', // no popup unless set
    subtitle: 'This line can\'t span multiple lines either',
    image: 'www/img/markers/hi.jpg' // TODO support this on a rainy day
  }, {
    lat: 52.3702160,
    lng: 4.8911680,
    title: 'One-line title here 2', // no popup unless set
    subtitle: 'This line can\'t span multiple lines either 2'
  }]).then(
    function(result) {
      console.log("Mapbox addMarkers done");
    },
    function(error) {
      console.log("mapbox addMarkers error: " + error);
    }
  );
};

SetTilt = function() {
  mapbox.setTilt({
    pitch: 35,
    duration: 4000
  }).then(
    function(result) {
      console.log("Mapbox doSetTilt done");
    },
    function(error) {
      console.log("mapbox doSetTilt error: " + error);
    }
  );
};

AnimateCamera = function() {
  mapbox.animateCamera({
    target: {
      lat: 52.3732160,
      lng: 4.8941680,
    },
    zoomLevel: 17, // Android
    altitude: 500, // iOS
    bearing: 270,
    tilt: 50,
    duration: 10
  }).then(
    function(result) {
      console.log("Mapbox doAnimateCamera done");
    },
    function(error) {
      console.log("mapbox doAnimateCamera error: " + error);
    }
  );
};

SetCenter = function() {
  mapbox.setCenter({
    lat: 52.3602160,
    lng: 4.8891680,
    animated: true
  }).then(
    function(result) {
      console.log("Mapbox setCenter done");
    },
    function(error) {
      console.log("mapbox setCenter error: " + error);
    }
  );
};

exports.GetCenter = function() {
  mapbox.getCenter().then(
    function(result) {
      dialogs.alert({
        title: "Center",
        message: JSON.stringify(result),
        okButtonText: "OK"
      });
    },
    function(error) {
      console.log("mapbox getCenter error: " + error);
    }
  );
};

GetZoomLevel = function() {
  mapbox.getZoomLevel().then(
    function(result) {
      dialogs.alert({
        title: "Zoom Level",
        message: JSON.stringify(result),
        okButtonText: "OK"
      });
    },
    function(error) {
      console.log("mapbox getCenter error: " + error);
    }
  );
};

SetZoomLevel = function() {
  mapbox.setZoomLevel({
    level: 6,
    animated: true
  }).then(
    function(result) {
      console.log("Mapbox setZoomLevel done");
    },
    function(error) {
      console.log("mapbox setZoomLevel error: " + error);
    }
  );
};

AddPolygon = function() {
  mapbox.addPolygon({
    points: [{
      lat: 52.3832160,
      lng: 4.8991680
    }, {
      lat: 52.3632160,
      lng: 4.9011680
    }, {
      lat: 52.3932160,
      lng: 4.8911680
    }]
  }).then(
    function(result) {
      console.log("Mapbox addPolygon done");
    },
    function(error) {
      console.log("mapbox addPolygon error: " + error);
    }
  );
};

exports.CheckHasFineLocationPermission = function() {
  mapbox.hasFineLocationPermission().then(
    function(granted) {
      dialogs.alert({
        title: "Permission granted?",
        message: granted ? "YES" : "NO",
        okButtonText: "OK"
      });
    }
  );
};

exports.RequestFineLocationPermission = function() {
  mapbox.requestFineLocationPermission().then(
    function() {
      console.log("Fine Location permission requested");
    }
  );
};

exports.openMenu = function() {
  var topmost = frameModule.topmost();
  topmost.navigate("views/main/main-page");
};