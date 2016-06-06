var view = require("ui/core/view");
var appModule = require("application");
var observable = require("data/observable").Observable;
var observableArray = require("data/observable-array").ObservableArray;
var frameModule = require("ui/frame");
var bluetoothManager = appModule.android.context.getSystemService(android.content.Context.BLUETOOTH_SERVICE);
var bluetoothAdapter = bluetoothManager.getAdapter();
var array = new observableArray();
var fetchModule = require("fetch");
var switchModule = require("ui/switch");
var dialogs = require("ui/dialogs");
var activityIndicatorModule = require("ui/activity-indicator");
var imageModule = require("ui/image");

var pageData = new observable();
pageData.set("items", new observableArray([{}]));
pageData.set("bt-scanning", false);

function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = pageData;
}


var watchId;

function bluetoothScanAction(args) {
    var page = args.object;

    if (bluetoothAdapter.isEnabled()){
        //// Bind the busy property of the indicator to the isLoading property of the image
        array = new observableArray();
        pageData.set("bt-scanning", true);
        appModule.android.unregisterBroadcastReceiver(android.bluetooth.BluetoothDevice.ACTION_FOUND);
        appModule.android.unregisterBroadcastReceiver(android.bluetooth.BluetoothAdapter.ACTION_DISCOVERY_FINISHED);

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
        console.log("bluetooth is enabled.");
        console.log("starting discovery...");
        var request = bluetoothAdapter.startDiscovery();
        var arrayEmpty = new observableArray();
        pageData.set("items", arrayEmpty);
    } else {
        dialogs.alert({
          title: "Bluetooth is disabled !",
          message: "Please, activate your Bluetooth to use this functionality.",
          okButtonText: "Ok"
        }).then(function (result) {

        });
    }
}

function bluetoothOnTap(args){
    appModule.android.unregisterBroadcastReceiver(android.bluetooth.BluetoothDevice.ACTION_BOND_STATE_CHANGED);
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


exports.pageLoaded = pageLoaded;
exports.bluetoothScanAction = bluetoothScanAction;
exports.bluetoothOnTap = bluetoothOnTap;