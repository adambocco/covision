function sendProviderRegister() {
	let xhr = new XMLHttpRequest();
	xhr.onload = loadProviderResults;
	xhr.onerror = function () {alert("XML Error, No Matches :(")};
    xhr.open("POST", "http://"+ window.location.hostname +"/register/provider");

    let email = document.getElementById('providerEmail').value;
    let name = document.getElementById('providerName').value;
    let password = document.getElementById('providerPassword1').value;
	xhr.send(JSON.stringify({"email":email, "name":name, "password":password}));
}

const loadProviderResults = function() {
	if (this.status == 200) {
		let obj = JSON.parse(this.responseText);
        if (obj.response === "emailTaken") {
            // CHANGE DOM TO SAY EMAIL TAKEN
            document.getElementById("emailTaken").style.display = "block";
        } else if (obj.response === "success") {
            console.log("success")
            window.location.replace("http://" + window.location.hostname + "/login")
            alert("Account successfully made! Redirecting to login...")
        }
	}
}

function sendCustomerRegister() {
	let xhr = new XMLHttpRequest();
	xhr.onload = loadCustomerResults;
	xhr.onerror = function () {alert("XML Error, No Matches :(")};
    xhr.open("POST", "http://"+ window.location.hostname +"/register/customer");

    let first = document.getElementById('customerFirst').value;
    let last = document.getElementById('customerLast').value;
    let email = document.getElementById('customerEmail').value;
    let password = document.getElementById('customerPassword1').value;
	xhr.send(JSON.stringify({"first":first, "last": last, "email":email, "password":password}));
}

const loadCustomerResults = function() {
	if (this.status == 200) {
		let obj = JSON.parse(this.responseText);
        if (obj.response === "emailTaken") {
            // CHANGE DOM TO SAY EMAIL TAKEN
            document.getElementById("emailTaken").style.display = "block";
        } else if (obj.response === "success") {
            console.log("success")
            window.location.replace("http://" + window.location.hostname + "/login")
            alert("Account successfully made! Redirecting to login...")
        }
    }
}

$(document).ready(function(){

    var $providerForm = $('#providerRegister');
    var $customerForm = $('#customerRegister');
    //jQuery validation
    $providerForm.validate({
        rules:{
            providerEmail:{
                required: true,
                email: true,
            },
            providerPassword1:{
                required: true,
                minlength: 8
            },
            providerPassword2:{
                required: true,
                equalTo: providerPassword1,
                
            }

        },
        messages:{
            providerEmail: {
                required: 'Please enter your email address.',
                email: 'Please enter a vaild email address.',
            },
            providerPassword1:{
                required: 'Please enter a password.',
                minlength: 'Password must be at least 8 characters',
            },
            providerPassword2:{
                required: 'Please enter your password again.',
                equalTo: 'Passwords do no match.'
            }
        },
        //allow the submit handler to send the ajax if the form is valid
        submitHandler: function(form){
            sendProviderRegister();
        }
    });
    $customerForm.validate({
        rules:{
            customerFirst:{
                required: true,
            },
            customerLast:{
                required: true,
            },
            customerEmail:{
                required: true,
                email: true,
            },
            customerPassword1:{
                required: true,
            },
            customerPassword2:{
                required: true, 
                equalTo: customerPassword1,
            }

        },
        messages:{
            customerFirst:{
                required: 'Please enter your first name.',
            },
            customerLast:{
                required: 'Please enter your last name.',
            },
            customerEmail:{
                required: 'Please enter your email address.',
                email: 'Please enter a valid email address.',
            },
            customerPassword1:{
                required: 'Please enter a password.',
            },
            customerPassword2:{
                required: 'Please enter your password again.',
                equalTo: 'Passwords do not match.'
            }
        },
        //allow the submit handler to send the ajax if the form is valid
        submitHandler: function(form){
            sendCustomerRegister();
        }
        
    });
 });



//document.getElementById("providerRegisterSubmit").addEventListener("click", sendProviderRegister);
//document.getElementById("customerRegisterSubmit").addEventListener("click", sendCustomerRegister);
