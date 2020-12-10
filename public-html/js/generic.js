



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

const login = document.getElementById('navLogin');
const register = document.getElementById('navRegister');
const logout = document.getElementById("navLogout");
const providerAddFacility = document.getElementById("providerAddFacility");
const userTab = document.getElementById("navUser");
const manageDonations = document.getElementById("providerManageDonations");


const handleLoginLogout = function () {
    let currentCookie = getCookie("sessionID");
    if (currentCookie != "" && currentCookie != null) {
        console.log("LOGGED IN");
        logout.style.display = "inline";
        login.style.display = "none";
        register.style.display = "none";
    }
    else {
        console.log("LOGGED OUT")
        logout.style.display = "none";
        login.style.display = "inline";
        register.style.display = "inline";
        userTab.style.display = "none";
    }
    let userCookie = getCookie("userType");
    if (userCookie == "2") {
        providerAddFacility.style.display = "inline-block";
        manageDonations.style.display = "inline-block";
        userTab.innerHTML = "Provider: " + getCookie("email");
        userTab.style.display = "inline";
    }
    else {
        providerAddFacility.style.display = "none";
        manageDonations.style.display = "none";
    }
    if (userCookie =="1") {
        userTab.innerHTML = "Customer: " + getCookie("email");
        userTab.style.display = "inline";
    }
}

const handleLogout = function () {
    let currentCookie = getCookie("sessionID");
    console.log(currentCookie);
    let xhr = new XMLHttpRequest();
    xhr.onload = () => { console.log("Logged out AJAX") }
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/logout");
    xhr.send(JSON.stringify({ "sessionID": currentCookie }));
    setCookie("sessionID", "", 365);
    setCookie("email", "", 365);
    setCookie("userType", "", 365)
    location.reload()
}
document.getElementById("navLogout").addEventListener("click", handleLogout);

const checkSession = function () {

    if (getCookie("sessionID") != "" && getCookie("sessionID") != null) {
        let xhr = new XMLHttpRequest();
        xhr.onload = loadSessionResults;
        xhr.onerror = function () { alert("XML Error, No Matches :(") };
        xhr.open("POST", "http://" + window.location.hostname + "/session/check");
        let uniqueID = getCookie("sessionID");
        xhr.send(JSON.stringify({ "sessionID": uniqueID }));
    }   
    else {
        setCookie("sessionID", "", 365);
        setCookie("email", "", 365);
        setCookie("userType", "", 365);
        handleLoginLogout();
    }

}
const loadSessionResults = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response === "loggedIn") {
            setCookie("sessionID", obj.sessionID, 365);
            setCookie("userType",obj.userType, 365)
            setCookie("email", obj.email, 365);
        } else {
            setCookie("sessionID", "", 365);
            setCookie("email", "", 365);
            setCookie("userType", "", 365);
        }
        handleLoginLogout();
    }
}
checkSession();