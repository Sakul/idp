"use strict";

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
            var shortBaseUrl = "https://s.manal.ink/np";
            var endpointId = "nidplog-000001";
            var cid = "cId=" + connectionId;
            var svc = "svcId=svc01";
            var flow = "flowId=F01";
            var endpointParams = endpointId + '%3F' + cid + '%26' + svc + '%26' + flow;

            var svcid = document.getElementById("hide-svcid").textContent;
            var baid = document.getElementById("hide-baid").textContent;
            var flowid = document.getElementById("hide-flowid").textContent;

            $("#loading-session").prop("hidden", true);
            connection.invoke("RequestLoginSessionQRUrl", svcid, baid, flowid, connectionId)
                .then(function (url) {
                    $("#login-session-heading").prop("hidden", false);
                    if (url == "") {
                        $("#login-session-failed").prop("hidden", false);
                    }
                    else {
                        $("#login-session-success").prop("hidden", false);
                        $("#qr1").prop("src", url);
                    }
                }).catch(function (err) {
                    console.error(err.toString());
                });



            //$("#qr1").prop("src", qrGeneratorUrl + shortBaseUrl + '%2F' + endpointParams);

            if ((/Mobi|Android/i.test(navigator.userAgent)) || /Mobi|iPad|iPhone|iPod/i.test(navigator.userAgent)) {
                $("#applink").prop("hidden", false);
                $("#universalUri").click(function () {
                    var app = {
                        launchApp: function () {
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
}).catch(function (err) {
    return console.error(err.toString());
});


