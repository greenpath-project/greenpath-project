var view = require("ui/core/view");
var geolocation = require("nativescript-geolocation");
var appModule = require("application");
var observable = require("data/observable").Observable;
var observableArray = require("data/observable-array").ObservableArray;
var frameModule = require("ui/frame");
var bluetoothManager = appModule.android.context.getSystemService(android.content.Context.BLUETOOTH_SERVICE);
var bluetoothAdapter = bluetoothManager.getAdapter();
var array = new observableArray();
var fetchModule = require("fetch");
var switchModule = require("ui/switch");

var pageData = new observable();
pageData.set("items", new observableArray([{}]));

function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = pageData;
}


var watchId;

function gpsTap(args){
    if (args.object.checked){
        console.log("[DEBUG] - GPS ACTION");
        gpsAction(args);
    } else {
        console.log("[DEBUG] - STOP GPS ACTION");
        stopGpsAction(args);
    }
}

function gpsAction(args) {
    var sender = args.object;
    var parent = sender.parent;
    var gpsLabelStatus = parent.parent.getViewById("gpsLabelStatus");
    var gpsLabelLatitude = parent.parent.getViewById("gpsLabelLatitude");
    var gpsLabelLongitude = parent.parent.getViewById("gpsLabelLongitude");
    var gpsLabelSpeed = parent.parent.getViewById("gpsLabelSpeed");

    if (geolocation.isEnabled()) {
        gpsLabelStatus.text = "Status: Watching GPS data...";
        watchId = geolocation.watchLocation(
        function (loc) {
            if (loc) {
                gpsLabelLatitude.text = "Latitude: "+loc.latitude;
                gpsLabelLongitude.text = "Longitude: "+loc.longitude;
                gpsLabelSpeed.text = "Speed: "+loc.speed;
                console.log("Logged a loc");
                sendDataAction(loc.latitude, loc.longitude, 10, 10, 10, 10);
            }
        }, 
        function(e){
            console.log("Error: " + e.message);
        }, 
        {desiredAccuracy: 3, updateDistance: 0, updateTime: 1000});
    } else {
        geolocation.enableLocationRequest();
    }
}

function stopGpsAction(args) {
    if (watchId) {
        var sender = args.object;
        var parent = sender.parent;
        var gpsLabelStatus = parent.parent.getViewById("gpsLabelStatus");
        gpsLabelStatus.text = "Status : Off.";
        geolocation.clearWatch(watchId);
    }
}

function bluetoothScanAction(args) {
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

function bluetoothOnTap(args){
    var index = args.index;
    var tappedMac = pageData.items.getItem(index).address;
    var tappedDevice = bluetoothAdapter.getRemoteDevice(tappedMac);

    tappedDevice.createBond();

    appModule.android.registerBroadcastReceiver(android.bluetooth.BluetoothDevice.ACTION_BOND_STATE_CHANGED, function onReceiveCallback(context, intent){
        var extra = intent.getIntExtra(android.bluetooth.BluetoothDevice.EXTRA_BOND_STATE, -1);
        if(extra == android.bluetooth.BluetoothDevice.BOND_BONDING){
            console.log("Pairing with " + tappedDevice.getName());
        }
        if(extra == android.bluetooth.BluetoothDevice.BOND_NONE){
            console.log("Not paired with " + tappedDevice.getName());
        }
        if(extra == android.bluetooth.BluetoothDevice.BOND_BONDED){
            console.log("Paired with " + tappedDevice.getName());
        }
    });
}

function sendDataAction(lat, lng, temperature, humidite, son, co2) {
    console.log("Send Data Action - Test");
    fetchModule.fetch("http://5.135.186.123:8080/api/captures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({lat: lat,lng: lng,temperature: temperature,humidite: humidite,son: son,co2: co2})
    })
    .then(function(response) {
        console.log({title: "POST Response", message: JSON.stringify(response), okButtonText: "Close"});
    }, function(error) {
        console.log(JSON.stringify(error));
    })
}

function pullDataAction(args) {
    console.log("Pull Data Action - Test");
    fetchModule.fetch('http://jsonplaceholder.typicode.com/users/7').then(function(response) { 
        return response.json();
    }).then(function(json) {
        console.log(JSON.stringify(json)); 
    });
}

exports.pageLoaded = pageLoaded;
exports.gpsAction = gpsAction;
exports.stopGpsAction = stopGpsAction;
exports.bluetoothScanAction = bluetoothScanAction;
exports.bluetoothOnTap = bluetoothOnTap;
exports.sendDataAction = sendDataAction;
exports.pullDataAction = pullDataAction;
exports.gpsTap = gpsTap;