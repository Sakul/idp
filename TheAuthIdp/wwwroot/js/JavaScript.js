﻿"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/sendstatus", { accessTokenFactory: () => this.loginToken }).build();

connection.on("ReceiveMessage", function (message, uid, baid) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    uid = uid.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    baid = baid.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = msg;
    $("#baid").prop("value", baid);
    $("#usernameid").prop("value", uid);
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    if (encodedMsg != null) {
        var validate = (encodedMsg == "complete")
        if (validate) {
            document.getElementById("complete").click();
        } else {
            document.getElementById("fail").click();
        }
    }
    else {
        alert("Something wrong. ");
        console.log("fail");

    }
});
connection.start().then(function () {
    connection.invoke('getConnectionId')
        .then(function (connectionId) {
            $("#signalRconnectionId").attr("value", connectionId);
            var appstorelink = "https://apps.apple.com/th/app/mana/id1273112680";
            var playstore_deeplink = "market://details?id=thes.mana.client";
            var playstorelink = "https://play.google.com/store/apps/details?id=thes.mana.client";
            var qrGeneratorUrl = "https://mana-facing-devtesting.azurewebsites.net/qr?t=";
            var shortBaseUrl = "https://s.manal.ink/auth/visit";
            var endpoint1 = "nxxxyyy-000001";
            var endpoint2 = "nxxxyyy-000002";
            var endpoint3 = "nxxxyyy-000003";
            var cid = "cid=" + connectionId;
            var baid01 = "baid=ba01";
            var baid03 = "baid=ba03";
            $("#qr1").prop("src", qrGeneratorUrl + shortBaseUrl + '%2F' + endpoint1 + '%3F' + cid + '%26' + baid01);
            $("#qr2").prop("src", qrGeneratorUrl + shortBaseUrl + '%2F' + endpoint2 + '%3F' + cid);
            $("#qr3").prop("src", qrGeneratorUrl + shortBaseUrl + '%2F' + endpoint3 + '%3F' + cid + '%26' + baid03);

            if ((/Mobi|Android/i.test(navigator.userAgent)) || /Mobi|iPad|iPhone|iPod/i.test(navigator.userAgent)) {
                $("#applink").prop("hidden", false);
                $("#universalUri").click(function () {
                    var app = {
                        launchApp: function () {
                            window.location.href = 'manarising://link?endpoint=' + shortBaseUrl + '%2F' + endpoint1 + '%3F' + cid + '%26' + baid01;
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
}).catch(function (err) {
    return console.error(err.toString());
});
