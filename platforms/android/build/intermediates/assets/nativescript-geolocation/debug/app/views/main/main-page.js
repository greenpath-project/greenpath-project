var vmModule = require("./main-view-model");
var view = require("ui/core/view");
var geolocation = require("nativescript-geolocation");
var appModule = require("application");

function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = vmModule.mainViewModel;
}

var watchid;

function gpsAction(args) {
    var sender = args.object;
    var parent = sender.parent;
    var gpsLabelStatus = parent.getViewById("gpsLabelStatus");
    var gpsLabelLatitude = parent.getViewById("gpsLabelLatitude");
    var gpsLabelLongitude = parent.getViewById("gpsLabelLongitude");
    var gpsLabelSpeed = parent.getViewById("gpsLabelSpeed");

    if (geolocation.isEnabled()) {
        gpsLabelStatus.text = "Status: Watching GPS data...";
        watchId = geolocation.watchLocation(
        function (loc) {
            if (loc) {
                gpsLabelLatitude.text = "Latitude: "+loc.latitude;
                gpsLabelLongitude.text = "Longitude: "+loc.longitude;
                gpsLabelSpeed.text = "Speed: "+loc.speed;
                console.log("Logged a loc");
            }
        }, 
        function(e){
            console.log("Error: " + e.message);
        }, 
        {desiredAccuracy: 3, updateDistance: 0, updateTime: 500});
    } else {
        geolocation.enableLocationRequest();
    }
}

function stopGpsAction(args) {
    if (watchId) {
        var sender = args.object;
        var parent = sender.parent;
        var gpsLabelStatus = parent.getViewById("gpsLabelStatus");
        gpsLabelStatus.text = "Status : Off.";
        geolocation.clearWatch(watchId);
    }
}

function bluetoothScanAction(args) {
    var bluetoothManager = appModule.android.context.getSystemService(android.content.Context.BLUETOOTH_SERVICE);
    var bluetoothAdapter = bluetoothManager.getAdapter();
    if (bluetoothAdapter.isEnabled()){
        console.log("bluetooth is enabled.");
    } else {
        console.log("bluetooth is disabled.");
    }
}

exports.pageLoaded = pageLoaded;
exports.gpsAction = gpsAction;
exports.stopGpsAction = stopGpsAction;
exports.bluetoothScanAction = bluetoothScanAction;
