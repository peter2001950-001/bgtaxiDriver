'use strict';

app.currentRequestView = kendo.observable({
    onShow: function() {
        $("#accepted-address").html(getFromLocalStorage("selectedRequestAddress"));
    },
    afterShow: function() {}
});


function saveInLocalStorage(key, info) {
    if (localStorage) {
        localStorage.setItem(key, info);
    } else {
        app[key] = info;
    }
}
function getFromLocalStorage(key) {
    if (localStorage) {
        return localStorage.getItem(key);
    } else {
        return app[key];
    }
}
function removeFromLocalStorage(key) {
    if (localStorage) {
        localStorage.removeItem(key);
    } else {
        app[key] = null;
    }
}
function alertMessage(message, strong, typeOf) {
    var element = document.getElementById("messageBox");
    element.className = "alert alert-" + typeOf;
    element.innerHTML = "<strong>" + strong + "</strong> " + message;

    document.getElementById('loading').style.visibility = "hidden";
}

// START_CUSTOM_CODE_currentRequestView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_currentRequestView