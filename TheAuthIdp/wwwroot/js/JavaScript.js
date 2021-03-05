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
            console.log("connectionID : " + connectionId);
            $("#signalRconnectionId").attr("value", connectionId);
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
        });
    
}).catch(function (err) {
    return console.error(err.toString());
});
