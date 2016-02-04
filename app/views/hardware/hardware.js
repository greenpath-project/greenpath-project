var view = require("ui/core/view");
var geolocation = require("nativescript-geolocation");
var appModule = require("application");
var observable = require("data/observable").Observable;
var observableArray = require("data/observable-array").ObservableArray;
var frameModule = require("ui/frame");

var pageData = new observable({
    items: new observableArray([
        {}
    ])
});

function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = pageData;
}


var watchId;

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
    var array = new observableArray();
    var page = args.object;

    if (bluetoothAdapter.isEnabled()){
        console.log("bluetooth is enabled.");
        console.log("starting discovery...");
        var request = bluetoothAdapter.startDiscovery();
        var arrayEmpty = new observableArray();
        pageData.set("items", arrayEmpty);
        console.log(request);
    } else {
        console.log("bluetooth is disabled.");
    }

    appModule.android.registerBroadcastReceiver(android.bluetooth.BluetoothDevice.ACTION_FOUND, function onReceiveCallback(context, intent) {
        var device = intent.getParcelableExtra(android.bluetooth.BluetoothDevice.EXTRA_DEVICE);
        array.push({title: device.getName(), address: device.getAddress(), btype: device.getType()});
        pageData.set("items", array);
        console.log("1 device found : " + device.getName() + " (" + device.getAddress()+") - B_CLASS: " + device.getType());
    });

    appModule.android.registerBroadcastReceiver(android.bluetooth.BluetoothAdapter.ACTION_DISCOVERY_FINISHED, function onReceiveCallback(context, intent) {
        console.log("scan finished.");
        appModule.android.unregisterBroadcastReceiver(android.bluetooth.BluetoothDevice.ACTION_FOUND);
        appModule.android.unregisterBroadcastReceiver(android.bluetooth.BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
    });
}

exports.openMenu = function () {
    var topmost = frameModule.topmost();
    topmost.navigate("views/main/main-page");
};

exports.pageLoaded = pageLoaded;
exports.gpsAction = gpsAction;
exports.stopGpsAction = stopGpsAction;
exports.bluetoothScanAction = bluetoothScanAction;
