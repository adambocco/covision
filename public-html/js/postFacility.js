
function sendPostFacility() {
	let xhr = new XMLHttpRequest();
	xhr.onload = loadPostFacility;
	xhr.onerror = function () {alert("XML Error, No Matches :(")};
    xhr.open("POST", "http://"+ window.location.hostname +"/post/facility/process");

    let type = document.getElementById('facilityChoice').value;
    let name = document.getElementById('facilityName').value;
    let address = document.getElementById('address').value;
    let city = document.getElementById('city').value;
    let phone = document.getElementById('phone').value;
    let sunday = document.getElementById('sunday').value;
    let monday = document.getElementById('monday').value;
    let tuesday = document.getElementById('tuesday').value;
    let wednesday = document.getElementById('wednesday').value;
    let thursday = document.getElementById('thursday').value;
    let friday = document.getElementById('friday').value;
    let saturday = document.getElementById('saturday').value;
    let hours = monday+","+tuesday+","+wednesday+","+thursday+","+friday+","+saturday+","+sunday;
    let facilityInfo = document.getElementById('info').value;
    let donating = document.getElementById('donateCheck').checked;
    let sessionID = getCookie("sessionID");
    type = type.replace(/\s/g, '');  // Makes 'Medical Facility' --> 'MedicalFacility', removes spaces
	xhr.send(JSON.stringify({"type":type, "name": name,"city": city,"address": address, "phone": phone, "hours" : hours, "info":facilityInfo, "donating": donating, "sessionID": sessionID}));
}

const loadPostFacility = function() {
	if (this.status == 200) {
		let obj = JSON.parse(this.responseText);
        if (obj.response === "nameTaken") {
            document.getElementById("nameTaken").style.display = "block";
        } else if (obj.response === "success") {
            console.log("success")
            window.location.replace("http://" + window.location.hostname + "/")
            alert("Facility posted! Redirecting to home...")
        }
	}
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


$(document).ready(function(){
jQuery.validator.addMethod("phone", function (phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^\(?[\d\s]{3}-[\d\s]{3}-[\d\s]{4}$/);
}, "Invalid phone number. Please enter a phone number with the following formatting: '555-555-5555'");

    var $postForm = $("#postFacility");
    $postForm.validate({
        rules:{
            facilityChoice:{
                required: true,
            },
            facilityName:{
                required: true,
            },
            address:{
                required: true,
            },
            city:{
                required: true,
            },
            phone:{
                required: true,
                phone: true,
            },
            sunday:{
                required:true
            },
            monday:{
                required:true
            },
            tuesday:{
                required:true
            },
            wednesday:{
                required:true
            },
            thursday:{
                required:true
            },
            friday:{
                required:true
            },
            saturday:{
                required:true
            },
        },
        messages:{
            facilityChoice:{
                required: 'Please select a facility type.'
            },
            facilityName:{
                required: 'Please enter the name of your facility.'
            },
            address:{
                required: 'Please enter the address of your facility.'
            },
            city:{
                required: 'Please enter the city of your facility.'
            },
            phone:{
                required: 'Please enter the phone number of your facility.'
            },
            sunday:{
                required: 'Please enter the hours you are open for each day.'
            },
            monday:{
                required: 'Please enter hours you are open for each day.'
            },
            tuesday:{
                required: 'Please enter the hours you are open for each day.'
            },
            wednesday:{
                required: 'Please enter hours you are open for each day.'
            },
            thursday:{
                required: 'Please enter the hours you are open for each day.'
            },
            friday:{
                required: 'Please enter hours you are open for each day.'
            },
            saturday:{
                required: 'Please enter the hours you are open for each day.'
            },
        },
        submitHandler: function(form){
            sendPostFacility();
        }
        
    });
});
