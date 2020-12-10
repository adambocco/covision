const requestFacilitiesAJAX = function(){
    let xhr= new XMLHttpRequest();
    xhr.onload = loadFacilities;
    xhr.onerror = function(){alert("XML Error, No matches :(")};
    xhr.open("POST", "http://" + window.location.hostname + "/provider/account")
    let type = getCookie("userType");
    let sessionID = getCookie("sessionID");
    let email = getCookie("email");
    if (type == "2" && sessionID != "" && sessionID != null && email != "" && email != null) {
        xhr.send(JSON.stringify({"type": type, "sessionID": sessionID, "email": email}))
    }
    else {
        window.location.replace("http://" + window.location.hostname + "/login.html")
    }
}

const sendUpdateFacility = function(facilityID, type){
    let xhr = new XMLHttpRequest();
    xhr.onerror = function(){alert("XML Error, No matches :(")};
    xhr.onload = loadUpdateFacility;
    xhr.open("POST", "http://" + window.location.hostname + "/provider/update");


    let name = document.getElementById('newName'+facilityID).value;
    let city = document.getElementById('newCity'+facilityID).value;
    let address = document.getElementById('newAddress'+facilityID).value;
    let phone = document.getElementById('newPhone'+facilityID).value;
    let sunday = document.getElementById('newSun'+facilityID).value;
    let monday = document.getElementById('newMon'+facilityID).value;
    let tuesday = document.getElementById('newTues'+facilityID).value;
    let wednesday = document.getElementById('newWeds'+facilityID).value;
    let thursday = document.getElementById('newThurs'+facilityID).value;
    let friday = document.getElementById('newFri'+facilityID).value;
    let saturday = document.getElementById('newSat'+facilityID).value;
    let info = document.getElementById('newInfo'+facilityID).value;
    let hours = monday+","+tuesday+","+wednesday+","+thursday+","+friday+","+saturday+","+sunday;
    let donating = document.getElementById('donateCheck'+facilityID).checked;

    let sessionID = getCookie('sessionID');

	xhr.send(JSON.stringify({ "sessionID":sessionID, "facilityID":facilityID, "type":type, "name": name,"city": city,"address": address, "phone": phone, "hours" : hours, "info":info, "donating": donating}));

}

const sendChangePassword = function(){
    let xhr = new XMLHttpRequest();
    xhr.onerror = function(){alert("XML Error, No matches :(")};
    xhr.onload = loadChangePassword;
    xhr.open("POST", "http://" + window.location.hostname + "/provider/changepassword");

    let currentPassword = document.getElementById('currentPassword').value;
    let newPassword = document.getElementById('newPassword1').value;
    let sessionID = getCookie('sessionID');

    console.log(currentPassword);
    console.log(newPassword);
    console.log(sessionID);

    xhr.send(JSON.stringify({"currentPassword":currentPassword, "newPassword":newPassword, "sessionID":sessionID}));
}

const loadChangePassword = function(){
    console.log(this);
    if(this.status == 200){
        let obj = JSON.parse(this.responseText);
        console.log(obj);     
        if (obj.response == "wrongPassword"){
            document.getElementById('wrongPassword').style.display = "block";
        }   
        else{
            document.getElementById('wrongPassword').style.display = "none";
            document.getElementById('currentPassword').value = "";
            document.getElementById('newPassword1').value = "";
            document.getElementById('newPassword2').value = "";
            $('#modalPassword').modal('toggle');
            document.getElementById('passwordChangeSuccess').style.display = "block";

        }
    }
}
const sendDeleteFacility = function(facilityID, type, donating){
    let xhr = new XMLHttpRequest();
    xhr.onerror = function(){alert("XML Error, No matches :(")};
    xhr.onload = loadDeleteFacility;
    xhr.open("POST", "http://" + window.location.hostname + "/provider/delete");

    console.log(JSON.stringify({"facilityID":facilityID, "type":type, "donating:":donating}));
    xhr.send(JSON.stringify({"facilityID":facilityID, "type":type, "donating":donating}));

}

const loadDeleteFacility = function(){
    console.log(this.status);
    if(this.status == 200){
        let obj = JSON.parse(this.responseText);
        console.log(obj);
        location.reload();
    }
}
const loadUpdateFacility = function(){
    console.log(this.staus);
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        console.log(obj);
        location.reload();
    }
}


const loadFacilities = function() {
	if (this.status == 200) {
        let container = document.getElementById("facilityListings");
        let obj = JSON.parse(this.responseText);
        let allFacilities = obj.medFacilities.concat(obj.testFacilities);


        console.log(allFacilities);
        if (obj.response == "success"){
            for (let facilities in allFacilities){
                console.log(facilities);
                let currentF = allFacilities[facilities];
                console.log(currentF);
                let hoursArray= currentF.facilityHours.split(",");
                let view = document.createElement("div");
                let facilityID = currentF.facilityID;
                let facilityType = currentF.facilityType;
                let current = currentF
                view.className = "row individualFacility my-3";
                view.innerHTML = `
                <div class ="col-md-6 my-3">
                    <h3 class="mx-4 my-4">${currentF.facilityName}</h3>
                    <h4 class="mx-5 my-3">Hours of Operation</h4>
                    <div class="col mx-3">
                        <table class="table-sm">
                            <thead>
                                <tr>
                                    <th scope="col">Day</th>
                                    <th scope="col">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="p-3">
                                    <td scope="row">Mon</td>
                                    <td scope="row">${hoursArray[0]}</td>
                                </tr>
                                <tr>
                                    <td scope="row">Tues</td>
                                    <td scope="row">${hoursArray[1]}</td>
                                </tr>
                                <tr>
                                    <td scope="row">Wed</td>
                                    <td scope="row">${hoursArray[2]}</td>
                                </tr>
                                <tr>
                                    <td scope="row">Thur</td>
                                    <td scope="row">${hoursArray[3]}</td>
                                </tr>
                                <tr>
                                    <td scope="row">Fri</td>
                                    <td scope="row">${hoursArray[4]}</td>
                                </tr>
                                <tr>
                                    <td scope="row">Sat</td>
                                    <td scope="row">${hoursArray[5]}</td>
                                </tr>
                                <tr>
                                    <td scope="row">Sun</td>
                                    <td scope="row">${hoursArray[6]}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                    <div class="col-md-6 my-5">
                        <p class="lead"> <strong>${currentF.facilityInfo}</strong>
                        </p>
                        <h3 class="text-center">Contact</h3>
                        <p class="lead text-center">
                        <ul class="lead">${currentF.facilityCity}</ul>
                        <ul class="lead">${currentF.facilityAddress}</ul>
                        <ul class="lead">${currentF.facilityPhone}</ul>
                        </p>
                    </div>
                    <div class = "col-md-6 my-5">
                        <button type="button" id="edit${facilityID}" class="btn btn-success btn-block">Edit Listing</button>
                    </div>
                    <div class = "col-md-6 my-5">
                        <button type="button" id ="delete${facilityID}"class="btn btn-danger btn-block">Delete Listing</button>
                    </div>`
                
                let edit = document.createElement("DIV");
                edit.className = "d-none";

                edit.innerHTML = `
                <div class ="col-sm-4" style="border-right: 1px solid">
                    <form id="form${facilityID}" method="POST">
                            <h3 class="text-center">Hours of Operation</h3>
                            <div>                       
                                <label for="newMon${facilityID}">Monday</label>
                                <input id="newMon${facilityID}" type="text" class="form-control" value=${hoursArray[0]}>
                            </div>
                            <div>                       
                                <label for ="newTues${facilityID}">Tuesday</label>
                                <input id="newTues${facilityID}" type="text" class="form-control" value=${hoursArray[1]}>
                            </div>
                            <div>                       
                                <label for ="newWeds${facilityID}">Wednesday</label>
                                <input id="newWeds${facilityID}" type="text" class="form-control" value=${hoursArray[2]}>
                            </div>
                            <div>                       
                                <label for ="newThurs${facilityID}">Thursday</label>
                                <input id="newThurs${facilityID}" type="text" class="form-control" value=${hoursArray[3]}>
                            </div>
                            <div>                       
                                <label for ="newFri${facilityID}">Friday</label>
                                <input id="newFri${facilityID}" type="text" class="form-control" value=${hoursArray[4]}>
                            </div>
                            <div>                       
                                <label for ="newSat${facilityID}">Saturday</label>
                                <input id="newSat${facilityID}" type="text" class="form-control" value=${hoursArray[5]}>
                            </div>
                            <div>                       
                                <label for ="newSun${facilityID}">Sunday</label>
                                <input id="newSun${facilityID}" type="text" class="form-control" value=${hoursArray[6]}>
                            </div>
                    </form>
                </div>

                <div class ="col-lg-8">
                    <form id="form2${facilityID}" method="POST">
                            <h3 class="text-center">Facility Information</h3>
                            <div class="row form-row-margin">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <label for="newName${facilityID}">Facility Name</label>
                                        <input id="newName${facilityID}" type="text" class="form-control" value="${currentF.facilityName}">
                                    </div>
                                </div>
                            </div>

                            <div class="row form-row-margin">
                                <div class="col-8 col-sm-6">
                                    <div class="form-group">
                                        <label for="newCity${facilityID}">City</label>
                                        <input id="newCity${facilityID}" type="text" class="form-control" value="${currentF.facilityCity}">
                                    </div>
                                </div>
                                <div class="col-8 col-sm-6">
                                    <div class="form-group">
                                        <label for="newPhone${facilityID}">Phone number</label>
                                        <input id="newPhone${facilityID}" type="text" class="form-control" value="${currentF.facilityPhone}">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="newAddress${facilityID}">Address</label>
                                <input id="newAddress${facilityID}" class="form-control" type="text" value="${currentF.facilityAddress}">                   
                            </div>
                            <div class ="form-group">
                                <label for="newInfo${facilityID}">About this facility</label>
                                <textarea id="newInfo${facilityID}" class="form-control" rows="4">${currentF.facilityInfo}</textarea>      
                            </div>
                            <div class="col">
                                <div class="form-check">
                                    <input id="donateCheck${facilityID}" class="form-check-input" type="checkbox">
                                    <label class="form-check-label" for="donateCheck${facilityID}">
                                        Click the checkbox to be part of our donation system, or uncheck it to remove your facility from the donation system.
                                    </label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-8 col-sm-6">
                                    <button type="button" id="cancel${facilityID}" class="btn btn-danger btn-block">Cancel</button>
                                </div>
                                <div class="col-8 col-sm-6">
                                    <button type="button" id="update${facilityID}" class="btn btn-success btn-block">Update Listing</button>
                                </div>

                `
                
              
                                
                container.appendChild(view);
                container.appendChild(edit);
                

                document.getElementById("edit"+facilityID).addEventListener('click', function(){ 
                    view.className = "d-none";
                    edit.className = "row individualFacility my-3";


                });

                document.getElementById("cancel"+facilityID).addEventListener('click', function(){ 
                    view.className = "row individualFacility my-3";
                    edit.className = "d-none";
                });

                document.getElementById("update"+facilityID).addEventListener('click', function(){
                    sendUpdateFacility(facilityID, currentF.facilityType, currentF.facilityDonating);

                });
                document.getElementById("delete"+facilityID).addEventListener('click', function(){
                    sendDeleteFacility(facilityID, currentF.facilityType, currentF.facilityDonating);
                });           
             }
        }
    }
}

document.getElementById('email').innerHTML = getCookie("email");

requestFacilitiesAJAX();


$(document).ready(function(){

    var $changePassword = $('#changePassword');
    //jQuery validation
    $changePassword.validate({
        rules:{
            currentPassword:{
                required: true,
                
            },
            newPassword1:{
                required: true,
                minlength: 8
            },
            newPassword2:{
                required: true,
                equalTo: newPassword1,
            }
        },
        messages:{
            currentPassword: {
                required: 'Please enter your current password.',
            },
            newPassword1:{
                required: 'Please enter a new password.',
                minlength: 'New password must be at least 8 characters.'
            },
            newPassword2:{
                required: 'Please enter your new password again.',
                equalTo: 'Passwords do no match.'
            }
        },
        //allow the submit handler to send the ajax if the form is valid
        submitHandler: function(form){
            console.log("submit handler : SENDING AJAX");
            sendChangePassword();
        }
    });

});

