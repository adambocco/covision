
function sendProviderAJAX() {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadProviderResults;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/login/provider");

    let email = document.getElementById('providerEmail').value;
    let password = document.getElementById('providerPassword').value;
    xhr.send(JSON.stringify({ "email": email, "password": password }));
}
const loadProviderResults = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response === "wrongPassword") {
            setCookie("sessionID", "", 365);
            setCookie("userType", "");
            setCookie("email", "", 365);
            document.getElementById("wrongPassword").style.display = "block";
        }
        else if (obj.response === "wrongEmail") {
            setCookie("sessionID", "", 365);
            setCookie("userType", "");
            setCookie("email", "", 365);
            document.getElementById("wrongPassword").style.display = "block";
        } else if (obj.response === "success") {
            console.log("success");
            setCookie("sessionID", obj.sessionID, 365);
            setCookie("userType", obj.userType, 365);
            setCookie("email", obj.email, 365);
            window.location.replace("http://" + window.location.hostname + "/")
        }
    }
}

function sendCustomerAJAX() {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadCustomerResults;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/login/customer");

    let email = document.getElementById('customerEmail').value;
    let password = document.getElementById('customerPassword').value;
    console.log("Logging customer in... " + email);
    xhr.send(JSON.stringify({ "email": email, "password": password }));
}
const loadCustomerResults = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response === "wrongPassword") {
            setCookie("sessionID", "", 365);
            setCookie("userType", "", 365);
            setCookie("email", "", 365);
            document.getElementById("wrongPassword").style.display = "block";
        }
        else if (obj.response === "wrongEmail") {
            console.log("WRonG EMAIL");
            setCookie("sessionID", "", 365);
            setCookie("userType", "", 365);
            setCookie("email", "", 365);
            document.getElementById("wrongPassword").style.display = "block";
        }
        else if (obj.response === "success") {
            console.log("success");
            setCookie("sessionID", obj.sessionID, 365);
            setCookie("userType", obj.userType, 365);
            setCookie("email", obj.email, 365);
            window.location.replace("http://" + window.location.hostname + "/")
        }
    }
}



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$(document).ready(function () {

    var $providerForm = $('#providerLogin');
    var $customerForm = $('#customerLogin');
    //jQuery validation
    $providerForm.validate({
        rules: {
            providerEmail: {
                required: true,
                email: true,
            },
            providerPassword: {
                required: true,
            }

        },
        messages: {
            providerEmail: {
                required: 'Please enter your email address.',
                email: 'Please enter a vaild email address.',
            },
            providerPassword: {
                required: 'Please enter your password.',
            },

        },
        //allow the submit handler to send the ajax if the form is valid
        submitHandler: function (form) {
            sendProviderAJAX();
        }
    });
    $customerForm.validate({
        rules: {
            customerEmail: {
                required: true,
                email: true,
            },
            customerPassword: {
                required: true,
            },

        },
        messages: {
            customerEmail: {
                required: 'Please enter your email address.',
                email: 'Please enter a valid email address.',
            },
            customerPassword: {
                required: 'Please enter your password.',
            },

        },
        //allow the submit handler to send the ajax if the form is valid
        submitHandler: function (form) {
            sendCustomerAJAX();
        }

    });
});


document.getElementById("customerForgot").addEventListener("click", function () {
    forgotClicked(false)
})
document.getElementById("providerForgot").addEventListener("click", function () {
    forgotClicked(true)
})

const forgotClicked = function (provider) {
    let container = document.getElementById("forgotContainer" + (provider ? "Provider" : "Customer"));
    if (document.getElementById((provider ? "provider" : "customer") + "Holder") == null) {
        document.getElementById((provider ? "provider" : "customer") + "Forgot").remove();

        let forgotEmailTitle = document.createElement("h2");
        forgotEmailTitle.innerHTML = "Password Reset";

        let forgotEmailInput = document.createElement("input");
        forgotEmailInput.setAttribute("type", "text");
        forgotEmailInput.className = "form-control m-1";
        forgotEmailInput.placeholder = "Enter Email"
        forgotEmailInput.id = (provider ? "provider" : "customer") + "ForgotInput"

        let forgotEmailSubmit = document.createElement("button");
        forgotEmailSubmit.setAttribute("type", "button");
        forgotEmailSubmit.className = "btn btn-info m-1";
        forgotEmailSubmit.innerHTML = "Send";
        forgotEmailSubmit.addEventListener("click", function () {
            sendForgotAJAX(provider)
        });

        let forgotEmailCancel = document.createElement("button");
        forgotEmailCancel.setAttribute("type", "button");
        forgotEmailCancel.className = "btn btn-danger m-1";
        forgotEmailCancel.innerHTML = "Cancel";
        forgotEmailCancel.addEventListener("click", function() {
            forgotClicked(provider);
        })

        let forgotEmailHolder = document.createElement("div");
        forgotEmailHolder.appendChild(forgotEmailTitle);
        forgotEmailHolder.appendChild(forgotEmailInput);
        forgotEmailHolder.appendChild(forgotEmailSubmit);
        forgotEmailHolder.appendChild(forgotEmailCancel);
        forgotEmailHolder.id = (provider ? "provider" : "customer") + "Holder";
        container.appendChild(forgotEmailHolder);
    }
    else {
        document.getElementById((provider ? "provider" : "customer") + "Holder").remove();
        let newBut = document.createElement("button");
        newBut.setAttribute("type", "button");
        newBut.className = "btn btn-outline-info p-1";
        newBut.innerHTML = "Forgot Password?";
        newBut.id= (provider ? "provider" : "customer")+"Forgot";
        newBut.addEventListener("click", function() {
            forgotClicked(provider);
        });
        container.appendChild(newBut);
    }
}

const sendForgotAJAX = function(provider) {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadForgotResults;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/forgot");
    let email = document.getElementById((provider ? "provider" : "customer") + 'ForgotInput').value;
    xhr.send(JSON.stringify({ "email": email, "userType": provider }));
}

const loadForgotResults = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response == "success") {
            alert("Please check your email for directions on how to reset your password.");
            forgotClicked(obj.userType);
        }
        else {
            alert("That email does not exist.");
            forgotClicked(obj.userType);

        }
    }
}