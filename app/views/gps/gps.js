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
var dialogs = require("ui/dialogs");
var activityIndicatorModule = require("ui/activity-indicator");
var imageModule = require("ui/image");
var http = require("http");

var pageData = new observable();
pageData.set("items", new observableArray([{}]));
pageData.set("bt-scanning", false);
pageData.set("serverStatus", "Offline");
pageData.set("serverStatusCounter", "Never");

function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = pageData;
}


var watchId;

function gpsTap(args){
    if (args.object.checked){
        gpsAction(args);
    } else {
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
    var gpsLabelLatitudelastsent = parent.parent.getViewById("latitude-last-sent");
    var gpsLabelLongitudelastsent = parent.parent.getViewById("longitude-last-sent");
    var gpsLabelSpeedlastsent = parent.parent.getViewById("speed-last-sent");
    if (geolocation.isEnabled()) {
        gpsLabelStatus.text = "Watching GPS data...";
        watchId = geolocation.watchLocation(
        function (loc) {
            if (loc) {
                gpsLabelLatitude.text = loc.latitude;
                gpsLabelLongitude.text = loc.longitude;
                gpsLabelSpeed.text = loc.speed;
                var currentdate = new Date();
                var datetime =  currentdate.getDate() + "/"
                                + (currentdate.getMonth()+1)  + "/" 
                                + currentdate.getFullYear() + "  "  
                                + currentdate.getHours() + "h "  
                                + currentdate.getMinutes() + "m " 
                                + currentdate.getSeconds() + "s";
                gpsLabelLatitudelastsent.text = datetime;
                gpsLabelLongitudelastsent.text = datetime;  
                gpsLabelSpeedlastsent.text = datetime;    
                console.log("Logged a loc");
                sendDataAction(loc.latitude, loc.longitude, 10, 10, 10, 10);
            }
        }, 
        function(e){
            console.log("Error: " + e.message);
        }, 
        {desiredAccuracy: 3, updateDistance: 0, updateTime: 1000});
    } else {
        dialogs.alert({
          title: "GPS is disabled !",
          message: "Please, activate your GPS to use this functionality.",
          okButtonText: "Ok"
        }).then(function (result) {
            var gpsSwitch = parent.parent.getViewById("gpsSwitch");
            gpsSwitch.checked = false;
        });
    }
}

function stopGpsAction(args) {
    if (watchId) {
        var sender = args.object;
        var parent = sender.parent;
        var gpsLabelStatus = parent.parent.getViewById("gpsLabelStatus");
        gpsLabelStatus.text = "Idling";
        geolocation.clearWatch(watchId);
    }
}

function sendDataAction(lat, lng, temperature, humidite, son, co2) {
    console.log("Send Data Action - Test");
    fetchModule.fetch("http://greenpath.jumpt.fr/api/captures", {
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

var counter = 10;
function testServer(){
    if(counter >= 10){
        http.request({ url: "http://greenpath.jumpt.fr/", method: "GET" }).then(function (response) {
            if(response.statusCode == "200"){
                pageData.set("serverStatus", "Online");
            } else {
                pageData.set("serverStatus", "Offline");
            }
        }, function (e) {
            pageData.set("serverStatus", "Offline");
        });
        counter = 1;
    } else {
        pageData.set("serverStatusCounter", counter + " seconds ago");
        counter++;
    }
    setTimeout(testServer, 1000); 
}
setTimeout(testServer, 1000); 

exports.pageLoaded = pageLoaded;
exports.gpsAction = gpsAction;
exports.stopGpsAction = stopGpsAction;
exports.sendDataAction = sendDataAction;
exports.pullDataAction = pullDataAction;
exports.gpsTap = gpsTap;