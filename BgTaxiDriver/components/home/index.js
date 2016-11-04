'use strict';

app.home = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home
(function(parent) {
    var provider = app.data.bgTaxiDriver,
        mode = 'signin',
        registerRedirect = 'home',
        signinRedirect = 'home',
        init = function(error, result) {
            $('.status').text('');

            if (error) {
                if (error.message) {
                    $('.status').text(error.message);
                }

                return false;
            }

            var activeView = mode === 'signin' ? '.signin-view' : '.signup-view',
                model = parent.homeModel;

            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.signin-view', 'signup-view').hide();
                $('.offline').show();
            } else {
                $('.offline').hide();

                if (mode === 'signin') {
                    $('.signup-view').hide();
                } else {
                    $('.signin-view').hide();
                }

                $(activeView).show();
            }

            if (model && model.set) {
                model.set('logout', null);
            }

        },
        successHandler = function(data) {
            var redirect = mode === 'signin' ? signinRedirect : registerRedirect,
                model = parent.homeModel || {},
                logout = model.logout;

            if (logout) {
                model.set('logout', null);
            }
            if (data && data.result) {
                if (logout) {
                    provider.Users.logout(init, init);
                    return;
                }

                var rememberedData = {		
                    email: model.email,		
                    password: model.password		
                };		
                if (model.rememberme && rememberedData.email && rememberedData.password) {		
                    if (localStorage) {		
                        localStorage.setItem(rememberKey, JSON.stringify(rememberedData));		
                    } else {		
                        app[rememberKey] = rememberedData;		
                    }		
                }
                app.user = data.result;

                setTimeout(function() {
                    app.mobileApp.navigate('components/' + redirect + '/view.html');
                }, 0);
            } else {
                init();
            }
        },
        homeModel = kendo.observable({
            displayName: '',
            email: '',
            password: '',
            errorMessage: '',
            validateData: function(data) {
                var model = homeModel;

                if (!data.email && !data.password) {
                    model.set('errorMessage', 'Missing credentials.');
                    return false;
                }

                if (!data.email) {
                    model.set('errorMessage', 'Missing username or email.');
                    return false;
                }

                if (!data.password) {
                    model.set('errorMessage', 'Missing password.');
                    return false;
                }

                return true;
            },
            signin: function() {
                var model = homeModel,
                    email = model.email.toLowerCase(),
                    password = model.password;

                if (!model.validateData(model)) {
                    return false;
                }

                 $.ajax({
                    url: "http://peter200195-001-site1.btempurl.com/Account/LoginExternal?email=" + email + "&password=" + password + "&requiredRoleId=06dee2c8-82df-42c5-9532-41adc70541f1",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    success: function (status) {
                        if (status.status == "OK") {
                
                            var rememberedData = {
                                email: email,
                                password: password,
                                result: email,
                                rememberme: true
                            };
                            successHandler(rememberedData);
                        } else {
                            init();
                        }
                    },
                    error: function () {
                        $("#messageBox").html("Error");
                        alert("error comunicating with serveer");
                    }
                });

            },
            register: function() {
                var model = homeModel,
                    email = model.email.toLowerCase(),
                    password = model.password,
                    displayName = model.displayName,
                    attrs = {
                        Email: email,
                        DisplayName: displayName
                    };

                if (!model.validateData(model)) {
                    return false;
                }

               $.ajax({
                    url: "http://peter200195-001-site1.btempurl.com/Account/RegisterExternal?email=" + email + "&password=" + password + "&dataRole=Driver",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    success: function (status) {
                        if (status.status == "OK") {
                            alert("success");
                            var rememberedData = {
                                email: email,
                                password: password,
                                result: displayName,
                                rememberme: true
                            };
                            successHandler(rememberedData);
                        } else {
                            init();
                        }
                    },
                    error: function () {
                        $("#messageBox").html("Error");
                        alert("error comunicating with serveer");
                    }
               

            });

            },
            toggleView: function() {
                var model = homeModel;
                model.set('errorMessage', '');

                mode = mode === 'signin' ? 'register' : 'signin';

                init();
            }
        });

    parent.set('homeModel', homeModel);
    parent.set('afterShow', function(e) {
        if (e && e.view && e.view.params && e.view.params.logout) {
            homeModel.set('logout', true);
        }
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.home);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeModel