if (window.navigator == undefined) {
    window.navigator = {};
}
setTimeout(function () {
    cordova.mock.trigger('deviceready');
}, 1000);

if (window.cordova == undefined) {
    window.cordova = {
        mock: {}
    };
}

cordova.exec = function (success, fail, className, methodName, paras) {
    if (success != null) {
        success();
    }
};

cordova.mock.trigger = function(eventName) {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(eventName, false, true);
    document.dispatchEvent(evt);
};

cordova.mock.triggerBackbutton = function () {
    this.trigger('backbutton');
};