'use strict';

app.requestsView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

function startSearching(){
    var timer = setInterval(function(){
    var userAndPass = JSON.parse(getFromLocalStorage("bgTaxiDriver_Auth_authData_homeView"));
    var tok = userAndPass.email + ':' + userAndPass.password;
    var hash = btoa(tok);
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { timeout: 45000 });

    function geoSuccess(possition){
        var positionCou = position.coords;
        $.ajax({
                            url: "http://bgtaxi.ne/request/approRequest?lon=" + positionCou.longitude + "&lat=" + positionCou.latitude + "&basicAuth=" +  hash,
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            success: function (status) {
                                if(status.status = "OK"){
                                    AddToTable(status.requests);
                                }
                            },
                            error: function () {
                                alertMessage("Проблем при свързването със сървъра","Грешка!","danger");
                            }
                        });
    }

    },3000);
}


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

function AddToTable(data){
    $(".table").append("<tr><td>"+ data.id + "</td><td>"+ data.address + "</td><td>"+ data.id + "</td><td>"+ data.distance + "</td><td>НЕ ПРИЕТА</td></tr>")
}
// START_CUSTOM_CODE_requestsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_requestsView