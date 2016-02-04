var view = require("ui/core/view");
var appModule = require("application");
var observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var buttonModule = require("ui/button");

exports.openParameter = function () {
    var topmost = frameModule.topmost();
    topmost.navigate("views/hardware/hardware");
};

exports.openMap = function () {
    var topmost = frameModule.topmost();
    alert("Coming Soon !!!");
};
