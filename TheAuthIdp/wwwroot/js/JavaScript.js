﻿"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/sendstatus", { accessTokenFactory: () => this.loginToken }).build();

connection.start()
    .then(function () {
        connection.invoke('getConnectionId')
            .then(function (connectionId) {
                $("#signalRconnectionId").attr("value", connectionId);
                var svcId = document.getElementById("hide-svcid").textContent;
                var flowId = document.getElementById("hide-flowid").textContent;
                $("#loading-session").prop("hidden", true);

                // Get QrUrl & DeepLinkUrl
                connection
                    .invoke("GetLoginUrl", svcId, flowId, connectionId)
                    .then(function (rsp) {
                        // Setup display
                        $("#login-session-heading").prop("hidden", false);
                        if (rsp === null) {
                            $("#login-session-failed").prop("hidden", false);
                        }
                        else {
                            $("#login-session-success").prop("hidden", false);
                            $("#qr1").prop("src", rsp.qrUrl);

                            if ((/Mobi|Android/i.test(navigator.userAgent)) || /Mobi|iPad|iPhone|iPod/i.test(navigator.userAgent)) {
                                $("#applink").prop("hidden", false);
                            }
                        }

                        // Setup links
                        var appstorelink = "itms://apps.apple.com/th/app/mana/id1273112680";
                        var playstore_deeplink = "market://details?id=thes.mana.client";
                        var playstorelink = "https://play.google.com/store/apps/details?id=thes.mana.client";
                        if ((/Mobi|Android/i.test(navigator.userAgent)) || /Mobi|iPad|iPhone|iPod/i.test(navigator.userAgent)) {
                            $("#universalUri").click(function () {
                                var app = {
                                    launchApp: function () {
                                        window.location.href = rsp.linkUrl;
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
                    })
                    .catch(function (err) {
                        console.error(err.toString());
                    });
            });
    })
    .catch(function (e) {
        return console.error(e.toString());
    });

connection.on("LoginStateChanged", function (isAgree, result) {
    if (isAgree) {
        $("#IsAgree1").prop("value", isAgree);
        $("#IsAgree2").prop("value", result.isAgree);
        $("#BaId").prop("value", result.baId);
        $("#UId").prop("value", result.uId);
        $("#DisplayName").prop("value", result.displayName);
        $("#ProfileImageUrl").prop("value", result.profileImageUrl);
        $("#BaHasSubscribed").prop("value", result.baHasSubscribed);
        $("#RefId").prop("value", result.refId);
        $("#LoginAs").prop("value", result.loginAs);
        document.getElementById("LogInBtn").click();
    }
    else {
        document.getElementById("CancelBtn").click();
    }
});