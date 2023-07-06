"use strict";

// Main object
window.ganjehChooser = {};
// Ganjeh domain
var targetUrl = "";
// Flag for check Ganjeh word in Ganjeh domain
var hasGanjeh = false;
// Listen For window closure
var viewWindowPopupInterval = "";
// Window name
var viewWindowPopup = "";
// User inputs
var options = "";

// Declare removeListener function
var removeListener = function () {
    var eventMethod = window.removeEventListener ? "removeEventListener" : "detachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent, eventHandler, false);
};
// Declare addListener function
var addListener = function () {
    // Listen for posted data from popup
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent, eventHandler, false);
};

// Main event
function eventHandler(event) {
    clearInterval(viewWindowPopupInterval);
    var originDomain = hasGanjeh ? event.origin + "/Ganjeh" : event.origin;
    if (originDomain !== targetUrl)
        return;
    // var origin = event.origin || event.originalEvent.origin;
    var data = event.data;
    if (Array.isArray(data)) {
        // Call user's SUCCESS function
        options.success(data);
    } else if (data == "CANCEL") {
        // Call user's CANCEL function
        options.cancel();
    }
    removeListener();
    viewWindowPopup.close();
};

window.ganjehChooser.choose = function (_options) {

    // Check whether or not the window is open
    if (viewWindowPopup && !viewWindowPopup.closed) {
        clearInterval(viewWindowPopupInterval);
        removeListener();
        viewWindowPopup.close();
    }

    options = _options;

    // Display the log when the user does not define SUCCESS callback
    if (typeof options.success !== "function") {
        console.warn('Provide a success callback to the Chooser to see the files that the user selects');
    }
    // Display the error when the user does not define accessToken field
    if (!options.accessToken) {
        throw new Error("accessToken field is necessary!");
    }
    // Display the error when the user does not define ganjehDomain field
    if (!options.ganjehDomain) {
        throw new Error("ganjehDomain field is necessary!");
    }

    // Window config
    // var w = 900;
    var w = 1024;
    // var h = 500;
    var h = 600;
    // var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    // var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;
    // var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    // var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    // var systemZoom = width / window.screen.availWidth;
    var left = (screen.width - w) / 2;
    // var left = (width - w) / 2 / systemZoom + dualScreenLeft;
    var top = (screen.height - h) / 4;
    // var top = (height - h) / 2 / systemZoom + dualScreenTop;

    // Ganjeh domain
    targetUrl = options.ganjehDomain;
    if (targetUrl.indexOf("Ganjeh")) {
        hasGanjeh = true;
    }

    // URL config
    var params = [];
    params.push("origin=" + window.location.protocol + "//" + window.location.host);
    params.push("accessToken=" + options.accessToken);
    if (options.multiselect)
        params.push("multiselect=true");
    if (options.extensions)
        params.push("extensions=" + options.extensions.join(','));
    if (options.sizelimit)
        params.push("sizelimit=" + options.sizelimit);
    var openWindowUrl = targetUrl + '/chooser/#/picker?' + params.join('&');

    // Open the window
    viewWindowPopup = window.open(openWindowUrl, 'view', "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
    // var viewWindowPopup = window.open(openWindowUrl, 'view', "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=" + w / systemZoom + ", height=" + h / systemZoom + ", top=" + top + ", left=" + left);

    // Send Info Within popup
    setTimeout(function () {
        viewWindowPopup.postMessage("اطلاعات ارسالی از پنجره پدر", targetUrl);
    }, 3000);

    // Listen For window closure
    viewWindowPopupInterval = setInterval(function () {
        if (viewWindowPopup.closed) {
            clearInterval(viewWindowPopupInterval);
            options.cancel();
            removeListener();
        }
    }, 1000);

    addListener();

};