var application = require("application");
var platform = require("platform");

if(platform.device.os === platform.platformNames.android) {
    application.onLaunch = function(intent) {
        application.android.onActivityCreated = function(activity) {
            var id = activity.getResources().getIdentifier("AppTheme", "style", activity.getPackageName());
            activity.setTheme(id);
        }
    }
}

application.mainModule = "views/main-page";
application.cssFile = "./app.css";
application.start();
