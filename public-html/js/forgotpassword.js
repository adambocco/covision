function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const loadForgotRequest = function() {
    let resetEmail = getCookie("resetEmail");
    let showEmail = document.getElementById("forgotEmail");
    showEmail.innerHTML = resetEmail;
}

const sendNewPassword = function() {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadNewPassword;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/reset/confirm");
    let resetUserID = getCookie("resetUserID");
    let resetType = getCookie("resetType");    
    let resetEmail = getCookie("resetEmail");
    let resetUniqueID = getCookie("resetUniqueID");
    let newPassword = document.getElementById("newPassword").value;
    xhr.send(JSON.stringify({ "userEmail": resetEmail, "newPassword": newPassword, "userType": resetType, "userID": resetUserID, "uniqueID": resetUniqueID}));
}
const loadNewPassword = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response == "success") {
            alert("Successfully changed password! Redirecting to login");
            window.location.replace("http://" + window.location.hostname + "/login");
        }
        else {
            alert("Failed to reset password...");
            window.location.replace("http://" + window.location.hostname + "/login");
        }
    }
}
document.getElementById("forgotPasswordSubmitButton").addEventListener("click", function() {
    sendNewPassword();
})

loadForgotRequest();