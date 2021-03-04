"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/sendstatus",{ accessTokenFactory: () => this.loginToken }).build();

document.getElementById("mybut").disabled = true;
``
connection.on("ReceiveMessage", function (message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    if (encodedMsg != null) {
        alert(encodedMsg);
        console.log("complete");
    }
    else {
        alert("Something wrong. ");
        console.log("fail");

    }
});
connection.start().then(function () {
    document.getElementById("mybut").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});
