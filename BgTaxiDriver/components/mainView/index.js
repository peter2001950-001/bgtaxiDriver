'use strict';

app.mainView = kendo.observable({
    onShow: function () {
        setInformation();
        pullStart();
    },
    afterShow: function () { }
});
app.localization.registerView('mainView');

function setInformation() {
    var userTb = document.getElementsByClassName("header-user-text")[0];
    userTb.innerHTML = localStorage.getItem("userShortInfo");
    switch (localStorage.getItem("status")) {
        case "free":
            alertStatus("СВОБОДЕН", "#7cf477", "#000000");
            break;
        case "busy":
            alertStatus("ЗАЕТ", "#ff283e");
            break;
        case "absent":
            alertStatus("ОТСЪСТВАЩ", "#ffa500" , "#000000");
            break;
        default:
            localStorage.setItem("status", "free");
            alertStatus("СВОБОДЕН", "#7cf477", "#000000");
            break;
    }
}

function pullStart() {
    localStorage.setItem("ActivePullRequest", "false");
    search();
    var timer = setInterval(search, 3000);
    function search() {
        if (localStorage.getItem("ActivePullRequest") == "false") {
            localStorage.setItem("ActivePullRequest", "true");
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { timeout: 5000 });

            function geoSuccess(position) {
                var positionCou = position.coords;

                saveInLocalStorage("currentLon", positionCou.longitude);
                saveInLocalStorage("currentLat", positionCou.latitude);
                $.ajax({
                    url: "http://bgtaxi.net/request/pull?lon=" + positionCou.longitude + "&lat=" + positionCou.latitude + "&accessToken=" + getFromLocalStorage("accessToken"),
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    success: function (status) {
                        localStorage.setItem("accessToken", status.accessToken);
                        if (status.status = "OK") {
                            localStorage.setItem("ActivePullRequest", "false");


                        } else if (status.status == "NO PERMISSIION") {
                            alert("Грешка при удостоверяването на самоличността");
                            localStorage.removeItem("basicAuth");
                            app.mobileApp.navigate('components/home/view.html');
                        } else if (satus.status == "INVALID ACCESSTOKEN") {
                            alert("INVALID ACCESSTOKEN");
                        }
                    },
                    error: function () {
                        alertStatus("Проблем при свързването със сървъра", "#167cf9");
                        localStorage.setItem("ActivePullRequest", "false");
                    }
                });
            }
            function geoError() {
                alertStatus("Търсене на GPS сигнал ...", "#cccccc");
            }
        }
    }

}

function alertStatus(message, color , textColor = "#ffffff") {
    var text = document.getElementsByClassName("header-status-text")[0];
    text.innerHTML = message;
    text.style.color = textColor;
    var node = text.parentNode;
    node.style.backgroundColor = color;
}
function goToMap(){
       app.mobileApp.navigate('components/requestsView/view.html');
}
// START_CUSTOM_CODE_mainView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_mainView