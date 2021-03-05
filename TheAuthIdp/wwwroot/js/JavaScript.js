"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/sendstatus", { accessTokenFactory: () => this.loginToken }).build();

document.getElementById("complete").disabled = true;
document.getElementById("complete").style.display = "none";
document.getElementById("fail").style.display = "none";
document.getElementById("buttonaera").style.display = "none";

connection.on("ReceiveMessage", function (message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    if (encodedMsg != null) {
        alert(encodedMsg);
        console.log(encodedMsg);

        var validate = (encodedMsg == "complete" )
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
    document.getElementById("complete").disabled = false;
    connection.invoke('getConnectionId')
        .then(function (connectionId) {
            console.log("connectionID : " + connectionId);
            $("#signalRconnectionId").attr("value", connectionId);
            var qrGeneratorUrl = "https://mana-facing-devtesting.azurewebsites.net/qr?t=";
            var shortBaseUrl = "https://s.manal.ink/auth/visit";
            var fullBaseUrl = "https://mana-facing-devtesting.azurewebsites.net/auth/visit/nxxxyyy-123456?cid=client123";
            var endpoint1 = "nxxxyyy-000001";
            var endpoint2 = "nxxxyyy-000002";
            var endpoint3 = "nxxxyyy-000003";
            var cid = "cid=" + connectionId;
            var rba = "rba=false";
            $("#qr1").prop("src", qrGeneratorUrl + shortBaseUrl + '%2F' + endpoint1 + '%3F' + cid + '%26' + rba);
            $("#qr2").prop("src", qrGeneratorUrl + shortBaseUrl + '%2F' + endpoint2 + '%3F' + cid + '%26' + rba);
            $("#qr3").prop("src", qrGeneratorUrl + shortBaseUrl + '%2F' + endpoint3 + '%3F' + cid + '%26' + rba);
            $("#qrf1").prop("src", qrGeneratorUrl + fullBaseUrl + '%2F' + endpoint1 + '%3F' + cid + '%26' + rba);
            $("#qrf2").prop("src", qrGeneratorUrl + fullBaseUrl + '%2F' + endpoint2 + '%3F' + cid + '%26' + rba);
            $("#qrf3").prop("src", qrGeneratorUrl + fullBaseUrl + '%2F' + endpoint3 + '%3F' + cid + '%26' + rba);
        });
    
}).catch(function (err) {
    return console.error(err.toString());
});
