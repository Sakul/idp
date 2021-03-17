"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/sendstatus", { accessTokenFactory: () => this.loginToken }).build();

connection.start()
    .then(function () {
        connection.invoke('getConnectionId')
            .then(function (connectionId) {
                $("#signalRconnectionId").attr("value", connectionId);
                var svcId = document.getElementById("hide-svcid").textContent;
                var flowId = document.getElementById("hide-flowid").textContent;
                $("#loading-session").prop("hidden", true);
                connection
                    .invoke("GetLoginUrl", svcId, flowId, connectionId)
                    .then(function (url) {
                        $("#login-session-heading").prop("hidden", false);
                        if (url == "") {
                            $("#login-session-failed").prop("hidden", false);
                        }
                        else {
                            $("#login-session-success").prop("hidden", false);
                            $("#qr1").prop("src", url);

                            if ((/Mobi|Android/i.test(navigator.userAgent)) || /Mobi|iPad|iPhone|iPod/i.test(navigator.userAgent)) {
                                $("#applink").prop("hidden", false);
                            }
                        }
                    })
                    .catch(function (err) {
                        console.error(err.toString());
                    });

                var appstorelink = "itms://apps.apple.com/th/app/mana/id1273112680";
                var playstore_deeplink = "market://details?id=thes.mana.client";
                var playstorelink = "https://play.google.com/store/apps/details?id=thes.mana.client";
                if ((/Mobi|Android/i.test(navigator.userAgent)) || /Mobi|iPad|iPhone|iPod/i.test(navigator.userAgent)) {
                    $("#universalUri").click(function () {
                        var app = {
                            launchApp: function () {
                                var endpointId = "nidplog-000001";
                                var clientIdQry = "cId=" + connectionId;
                                var svcIdQry = "svcId=" + svcId;
                                var flowIdQry = "flowId=" + flowId;
                                var QUESTION = '%3F';
                                var AND = '%26';
                                var endpointParams = endpointId + QUESTION + clientIdQry + AND + svcIdQry + AND + flowIdQry;
                                window.location.href = 'manarising://link?np=' + endpointParams;
                                setTimeout(this.openWebApp, 1000);
                            },

                            openWebApp: function () {
                                if ((/Mobi|Android/i.test(navigator.userAgent))) {
                                    window.location.href = playstore_deeplink;
                                }
                                if (/Mobi|iPad|iPhone|iPod/i.test(navigator.userAgent)) {
                                    window.location.href = appstorelink;
                                }
                            }
                        };

                        app.launchApp();
                    });
                }
                else {
                    $("#storelink").prop("hidden", false);
                    $("#playstore").prop("href", playstorelink);
                    $("#appstore").prop("href", appstorelink);
                }
            });
    })
    .catch(function (e) {
        return console.error(e.toString());
    });

connection.on("LoginStateChanged", function (message, uid, baid) {

    $("#baid").prop("value", baid);
    $("#usernameid").prop("value", uid);

    if (message != null) {
        var validate = (message == "complete")
        if (validate) {
            document.getElementById("complete").click();
        } else {
            document.getElementById("fail").click();
        }
    }
});