
const postDonationSuccess = document.getElementById("postDonationSuccess");
const postDonationFailed = document.getElementById("postDonationFailed");

const imageInput = document.querySelector('#donationImage');
const imagePreview = document.querySelector('#previewImage');


const requestFacilitiesAJAX = function () {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadFacilities;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/provider/facilities");
    let type = getCookie("userType");
    let sessionID = getCookie("sessionID");
    let email = getCookie("email");
    if (type == "2" && sessionID != "" && sessionID != null && email != "" && email != null) {
        xhr.send(JSON.stringify({ "type": type, "sessionID": sessionID, "email": email }))
    }
    else {
        window.location.replace("http://" + window.location.hostname + "/login.html")
    }
}



const loadFacilities = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response === "success") {
            for (let i = 0; i < obj.medFacilities.length; i++) {
                let newOption = document.createElement("option");
                newOption.setAttribute("facilitytype", "M");
                newOption.setAttribute("facilityid", obj.medFacilities[i].facilityID);
                newOption.innerHTML = obj.medFacilities[i].facilityName;
                document.getElementById("facilityChoice").appendChild(newOption)
            }
            for (let i = 0; i < obj.testFacilities.length; i++) {
                let newOption = document.createElement("option");
                newOption.setAttribute("facilitytype", "T");
                newOption.setAttribute("facilityid", obj.testFacilities[i].facilityID);
                newOption.innerHTML = obj.testFacilities[i].facilityName;
                document.getElementById("facilityChoice").appendChild(newOption)
            }
            let donations = obj.yourDonations;
            for (let i = 0; i < donations.length; i++) {

                let rootLi = document.createElement("li");
                rootLi.className = "list-group-item";
                rootLi.id = donations[i]["Donation_ID"];
                let rootContainer = document.createElement("div");
                rootContainer.className = "container m-0";
                let row1 = document.createElement("row");
                row1.className = "row d-flex justify-content-between";
                let row2 = document.createElement("row");
                row2.className = "row";
                let quantityCol = document.createElement("div");
                quantityCol.className = "col d-flex justify-content-center";
                let quantitySpan = document.createElement("span");
                quantitySpan.id = "quantity" + donations[i]["Donation_ID"]
                quantitySpan.innerHTML = donations[i]["Quantity"]
                quantityCol.appendChild(quantitySpan);
                quantitySpan.className = "h1";
                let nameCol = document.createElement("div");
                nameCol.className = "col h3";
                nameCol.innerHTML = donations[i]["Name"];
                let buttonCol = document.createElement("div");
                buttonCol.className = "col d-flex justify-content-end";

                let deleteButton = document.createElement("button");
                deleteButton.setAttribute("type", "button");
                deleteButton.className = "btn btn-danger mx-1";
                deleteButton.addEventListener("click", function () {
                    sendDeleteDonation(donations[i]["Donation_ID"]);
                })

                let updateButton = document.createElement("button");
                updateButton.setAttribute("type", "button");
                updateButton.className = "btn btn-info mx-1";
                updateButton.addEventListener("click", function () {
                    updateDonation(donations[i]["Donation_ID"]);
                })
                let updateMark = document.createElement("i");
                updateMark.className = "fas fa-pen"
                updateButton.appendChild(updateMark);

                let xMark = document.createElement("i");
                xMark.className = "fas fa-times";
                deleteButton.appendChild(xMark);
                let buttonHolder = document.createElement("div");
                buttonHolder.className = "align-self-end";
                buttonHolder.appendChild(updateButton);
                buttonHolder.appendChild(deleteButton);
                buttonCol.appendChild(buttonHolder);
                row1.appendChild(nameCol);
                row1.appendChild(quantityCol);

                if (donations[i]["ImageID"] != null && donations[i]["ImageID"] != "") {
                    let donImg = document.createElement('img');
                    donImg.src = "./donationImages/"+donations[i]["ImageID"]+".jpg"
                    donImg.className = "w-auto";
                    donImg.style = "max-height:200px;";
                    row1.appendChild(donImg);
                }

                row1.appendChild(buttonCol);
                let descriptionCol = document.createElement("div");
                descriptionCol.className = "col-9";
                descriptionCol.innerHTML = donations[i]["Description"]
                let facilityCol = document.createElement("div");
                facilityCol.className = "col-3";
                let facilityName;
                if (donations[i]["Med_Facility_ID"] == null || donations[i]["Med_Facility_ID"] == "") {
                    for (let j = 0; j < obj.testFacilities.length; j++) {;
                        if (donations[i]["Testing_Facility_ID"] == obj.testFacilities[j].facilityID) {
                            facilityName = obj.testFacilities[j].facilityName;

                            break;
                        }
                    }
                }
                else {
                    for (let j = 0; j < obj.medFacilities.length; j++) {

                        if (donations[i]["Med_Facility_ID"] == obj.medFacilities[j].facilityID) {
                            facilityName = obj.medFacilities[j].facilityName;
                            break;
                        }
                    }
                }
                facilityCol.innerHTML = facilityName;
                row2.appendChild(descriptionCol);
                row2.appendChild(facilityCol);

                rootContainer.appendChild(row1);
                rootContainer.appendChild(row2);
                rootLi.appendChild(rootContainer);

                document.getElementById("providerDonationListings").appendChild(rootLi);
            }
            let req = obj.yourRequests;

            for (let i = 0; i < req.length; i++) {
                let requestLi = document.createElement("li");
                requestLi.className = "list-group-item"
                requestLi.innerHTML = "<p><span style='font-size:2em;'>" + req[i]["QuantityRequested"] + " " + req[i]["DonationName"] + "</span><br><span class='font-weight-bold'>Recipient: " + req[i]["FirstName"] + " " + req[i]["LastName"] +
                    "<br>" + req[i]["Email"] + "</span><br><br><span class='text-muted'>In Stock " + (req[i]["Ready"] == 1 ? "(Pending)" : "") + ": " + req[i]["QuantityAvailable"] + " : " +
                    req[i]["FacilityName"] + "</span></p>";
                requestLi.id = "request" + req[i]["Request_ID"];

                if (req[i]["Ready"] == 1) {
                    let pendingHolder = document.createElement("div");
                    let clear = document.createElement("button");
                    let reject = document.createElement("button");
                    clear.setAttribute("type", "button");
                    reject.setAttribute("type", "button");
                    clear.innerHTML = "Processed Successfully";
                    clear.className = "btn btn-success m-1";
                    reject.innerHTML = "Reject/Failed to Pickup";
                    reject.className = "btn btn-danger m-1"
                    reject.addEventListener("click", function () {
                        rejectedRequest(req[i]["Donation_ID"], req[i]["Request_ID"])
                    })
                    clear.addEventListener("click", function () {
                        clearRequest(req[i]["Request_ID"]);
                    })
                    pendingHolder.appendChild(clear);
                    pendingHolder.appendChild(reject);
                    requestLi.appendChild(pendingHolder);
                }
                else {
                    let confirmButton = document.createElement("button");
                    confirmButton.setAttribute("type", "button");
                    let confirmMark = document.createElement("i");
                    confirmMark.className = "fas fa-check"
                    confirmButton.appendChild(confirmMark);
                    confirmButton.className = "btn btn-success m-1"
                    confirmButton.addEventListener("click", function () {
                        confirmRequestHandler({ donationID: req[i]["Donation_ID"], customerID: req[i]["Customer_ID"], requestID: req[i]["Request_ID"], email: req[i]["Email"], fName: req[i]["FirstName"], lName: req[i]["LastName"], requestedQuantity: req[i]["QuantityRequested"], "availableQuantity": req[i]["QuantityAvailable"], facility: req[i]["FacilityName"], city: req[i]["City"], donationName: req[i]["DonationName"], address: req[i]["Address"] });
                    })
                    let deleteButton = document.createElement("button");
                    deleteButton.setAttribute("type", "button");
                    deleteButton.className = "btn btn-danger m-1";
                    deleteButton.addEventListener("click", function () {
                        clearRequest(req[i]["Request_ID"]);
                    })

                    let xMark = document.createElement("i");
                    xMark.className = "fas fa-times";
                    deleteButton.appendChild(xMark);
                    let buttonHolder = document.createElement("div");
                    buttonHolder.className = "ml-auto";
                    buttonHolder.id = "requestButtonHolder" + req[i]["Request_ID"];
                    buttonHolder.appendChild(confirmButton);
                    buttonHolder.appendChild(deleteButton);
                    requestLi.appendChild(buttonHolder);
                }

                document.getElementById("providerRequestListings").appendChild(requestLi);
            }
            let don = obj.donatedToYou;
            for (let i = 0; i < don.length; i++) {
                let donationLi = document.createElement("li");
                donationLi.className = "list-group-item"
                donationLi.innerHTML = don[i]["Body"]
                donationLi.id = "notification" + don[i]["Message_ID"]
                let confirmButton = document.createElement("button");
                confirmButton.innerHTML = "Acknowledge ";
                confirmButton.setAttribute("type", "button");
                let confirmMark = document.createElement("i");
                confirmMark.className = "fas fa-check"
                confirmButton.appendChild(confirmMark);
                confirmButton.className = "btn btn-success m-1"
                confirmButton.addEventListener("click", function () {
                    clearNotification({ "messageID": don[i]["Message_ID"] });
                })
                let deleteButton = document.createElement("button");
                deleteButton.setAttribute("type", "button");
                deleteButton.className = "btn btn-danger m-1";

                let xMark = document.createElement("i");
                xMark.className = "fas fa-times";
                deleteButton.appendChild(xMark);
                let buttonHolder = document.createElement("div");
                buttonHolder.className = "ml-auto";
                buttonHolder.appendChild(confirmButton);
                // buttonHolder.appendChild(deleteButton);
                donationLi.appendChild(buttonHolder);

                document.getElementById("donationNotificationListings").appendChild(donationLi);
            }




        } else if (obj.response == "noFacilities") {
            window.location.replace("http://" + window.location.hostname + "/postfacility.html")
            alert("Please post a facility first");
        } else if (obj.response == "loggedOut") {
            window.location.replace("http://" + window.location.hostname + "/postfacility.html")
            alert("Please login");
        }
    }
}
requestFacilitiesAJAX();

const clearNotification = function ({ messageID }) {
    document.getElementById("notification" + messageID).remove();
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        console.log("Cleared Notification!")
    };
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("DELETE", "http://" + window.location.hostname + "/delete/message?messageID=" + messageID);
    xhr.send();
}


function sendPostDonation() {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadPostDonation;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/post/donation/process");
    let facilityName;
    let facilityType;
    let facilityID;
    let nodes = document.getElementById("facilityChoice").childNodes;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].selected == true) {
            facilityName = nodes[i].innerHTML;
            facilityType = nodes[i].getAttribute("facilityType");
            facilityID = nodes[i].getAttribute("facilityID");
            break;
        }
    }
    let donationName = document.getElementById('donationName').value;
    let quantity = document.getElementById('donationQuantity').value;
    let description = document.getElementById("donationDescription").value;

    let sessionID = getCookie("sessionID");
    xhr.send(JSON.stringify({ "donationName": donationName, "quantity": quantity, "description": description, "facilityName": facilityName, "facilityType": facilityType, "facilityID": facilityID, "sessionID": sessionID }));
}
const sendImage = function(donationID) {
    let x = new XMLHttpRequest();
    x.onload = (x)=> {
        console.log("X: ",x.target)
        if (x.target.status == 200) {
            let obj = JSON.parse(x.target.responseText);
            let donImg = document.createElement('img');
            donImg.src = "./donationImages/"+obj.uniqueID+".jpg"
            donImg.className = "w-auto"
            donImg.style = "max-height:200px;";
            document.querySelector('#donationImage'+donationID).appendChild(donImg);
            console.log("PASTED IMAGE")
        }
    }
    x.onerror = ()=> {console.log("no work...")}
    x.open("POST", "http://"+window.location.hostname+"/upload/image?donationID="+donationID);
    let file = imageInput.files[0];
    x.send(file);
}

const loadPostDonation = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response == "nameTaken") {
            postDonationFailed.style.display = "block";
            postDonationSuccess.style.display = "none";
        }
        else if (obj.response == "loggedOut") {
            setCookie("sessionID", "", 365);
            setCookie("email", "", 365);
            setCookie("userType", "", 365)
            window.location.replace("http://" + window.location.hostname + "/login.html")
        }
        else if (obj.response == "success") {
            sendImage(obj.insertedID);
            document.getElementById('donationName').value = "";
            document.getElementById('donationQuantity').value = "";
            document.getElementById("donationDescription").value = "";
            document.getElementById("facilityChoice").value = "";
            imageInput.value = "";
            while (imagePreview.firstChild) {
                imagePreview.removeChild(imagePreview.firstChild);
            }



            postDonationSuccess.style.display = "block";
            postDonationFailed.style.display = "none";

            let rootLi = document.createElement("li");
            rootLi.className = "list-group-item";
            rootLi.id = obj.insertedID;
            let rootContainer = document.createElement("div");
            rootContainer.className = "container m-0";
            let row1 = document.createElement("row");
            row1.className = "row d-flex justify-content-between";
            let row2 = document.createElement("row");
            row2.className = "row";
            let quantityCol = document.createElement("div");
            quantityCol.className = "col d-flex justify-content-center";
            let quantitySpan = document.createElement("span");
            quantitySpan.id = "quantity" + obj.insertedID;
            quantitySpan.innerHTML = obj.quantity;
            quantitySpan.className = "h1";
            quantityCol.appendChild(quantitySpan);
            let nameCol = document.createElement("div");
            nameCol.className = "col h3";
            nameCol.innerHTML = obj.donationName;
            let buttonCol = document.createElement("div");
            buttonCol.className = "col d-flex justify-content-end";

            let deleteButton = document.createElement("button");
            deleteButton.setAttribute("type", "button");
            deleteButton.className = "btn btn-danger mx-1";
            deleteButton.addEventListener("click", function () {
                sendDeleteDonation(obj.insertedID);
            })

            let updateButton = document.createElement("button");
            updateButton.setAttribute("type", "button");
            updateButton.className = "btn btn-info mx-1";
            updateButton.addEventListener("click", function () {
                updateDonation(obj.insertedID);
            })
            let updateMark = document.createElement("i");
            updateMark.className = "fas fa-pen"
            updateButton.appendChild(updateMark);

            let xMark = document.createElement("i");
            xMark.className = "fas fa-times";
            deleteButton.appendChild(xMark);
            let buttonHolder = document.createElement("div");
            buttonHolder.className = "align-self-end";
            buttonHolder.appendChild(updateButton);
            buttonHolder.appendChild(deleteButton);
            buttonCol.appendChild(buttonHolder);
            row1.appendChild(nameCol);
            row1.appendChild(quantityCol);
            let imgDiv = document.createElement('div');
            imgDiv.id = "donationImage"+obj.insertedID;
            row1.appendChild(imgDiv);


            row1.appendChild(buttonCol);

            let descriptionCol = document.createElement("div");
            descriptionCol.className = "col-9";
            descriptionCol.innerHTML = obj.description;
            let facilityCol = document.createElement("div");
            facilityCol.className = "col-3";
            facilityCol.innerHTML = obj.facilityName;
            row2.appendChild(descriptionCol);
            row2.appendChild(facilityCol);

            rootContainer.appendChild(row1);
            rootContainer.appendChild(row2);
            rootLi.appendChild(rootContainer);
            document.getElementById("providerDonationListings").appendChild(rootLi);
        }
    }
}

const sendDeleteDonation = function (donationID) {
    console.log("Trying to delete");
    let xhr = new XMLHttpRequest();
    xhr.onload = loadDeleteDonation;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/delete/donation");
    let sessionID = getCookie("sessionID");
    xhr.send(JSON.stringify({ "donationID": donationID, "sessionID": sessionID }));
}

const loadDeleteDonation = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response == "failed") {
            console.log("Failed to delete post");
        } else if (obj.response == "success") {
            document.getElementById(obj.deletedID).remove();
        }
    }
}


const updateDonation = function (donationID) {
    if (document.getElementById("quantity" + donationID).className == "d-none") {
        document.getElementById("update" + donationID).remove();
        document.getElementById("quantity" + donationID).className = "d-flex mx-1 align-center h1"
    }
    else {
        console.log("quantity" + donationID);
        let q = document.getElementById("quantity" + donationID);
        let d = document.createElement("div");
        d.id = "update" + donationID;
        d.className = "d-flex"
        let input = document.createElement("input");
        let btn = document.createElement("button");
        input.setAttribute("type", "number");
        input.value = q.innerText;
        input.className = "form-control ";
        btn.className = "btn btn-info";
        btn.innerHTML = "Update";
        d.appendChild(input);
        d.appendChild(btn);
        q.insertAdjacentElement("afterend", d);
        q.className = "d-none";
        btn.addEventListener("click", function () { sendUpdateDonation(input.value, donationID) });
    }
}

const sendUpdateDonation = function (newQuantity, donationID) {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadUpdateDonation;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/update/donation");
    let sessionID = getCookie("sessionID");
    xhr.send(JSON.stringify({ "newQuantity": newQuantity, "donationID": donationID, "sessionID": sessionID }));
}

const loadUpdateDonation = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response == "failed") {
            console.log("Failed to update post");
        } else if (obj.response == "success") {
            document.getElementById("update" + obj.donationID).remove();
            let q = document.getElementById("quantity" + obj.donationID);
            q.innerHTML = obj.newQuantity;
            q.className = "d-flex mx-1 align-center h1";

        }
    }
}

const confirmRequestHandler = function (body) {
    if (document.getElementById("optMsgHolder" + body.requestID) == null) {
        document.getElementById("requestButtonHolder" + body.requestID).remove();
        let optionalMessageHolder = document.createElement("div");
        let optionalMessage = document.createElement("textarea");
        let optionalMessageSend = document.createElement("button");
        let optionalMessageCancel = document.createElement("button");
        optionalMessage.id = "optMsgContent" + body.requestID;
        optionalMessage.placeholder = "Send a message to the recipient (optional)";
        optionalMessageSend.setAttribute("type", "button");
        optionalMessageCancel.setAttribute("type", "button");
        optionalMessageSend.innerHTML = "Send";
        optionalMessageCancel.innerHTML = "Cancel";
        optionalMessageSend.className = "btn btn-success m-1";
        optionalMessageCancel.className = "btn btn-danger m-1";
        optionalMessageSend.addEventListener("click", function () {
            let msg = document.getElementById("optMsgContent" + body.requestID).value;
            confirmRequest(body, msg);
        });
        optionalMessageCancel.addEventListener("click", function () {
            confirmRequestHandler(body);
        });
        optionalMessageHolder.appendChild(optionalMessage);
        optionalMessageHolder.appendChild(optionalMessageSend);
        optionalMessageHolder.appendChild(optionalMessageCancel);
        optionalMessageHolder.id = "optMsgHolder" + body.requestID;
        document.getElementById("request" + body.requestID).appendChild(optionalMessageHolder);
    }
    else {
        document.getElementById("optMsgHolder" + body.requestID).remove();
        let confirmButton = document.createElement("button");
        confirmButton.setAttribute("type", "button");
        let confirmMark = document.createElement("i");
        confirmMark.className = "fas fa-check"
        confirmButton.appendChild(confirmMark);
        confirmButton.className = "btn btn-success m-1"
        confirmButton.addEventListener("click", function () {
            confirmRequestHandler(body);
        })
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.className = "btn btn-danger m-1";

        let xMark = document.createElement("i");
        xMark.className = "fas fa-times";
        deleteButton.appendChild(xMark);
        let buttonHolder = document.createElement("div");
        buttonHolder.className = "ml-auto";
        buttonHolder.id = "requestButtonHolder" + body.requestID;
        buttonHolder.appendChild(confirmButton);
        buttonHolder.appendChild(deleteButton);
        document.getElementById("request" + body.requestID).appendChild(buttonHolder);
    }
}


const confirmRequest = function ({ donationID, requestID, customerID, email, fName, lName, requestedQuantity, availableQuantity, facility, city, donationName, address }, optionalMessage) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.status == 200) {
            let obj = JSON.parse(this.responseText);
            if (obj.response == "success") {
                document.querySelector('#quantity' + obj.donationID).innerHTML = obj.newQuantity;
                try {
                    document.getElementById("optMsgHolder" + obj.requestID).remove();
                }
                catch (err) {
                    console.log(err);
                }
                try {
                    document.getElementById("requestButtonHolder" + obj.requestID).remove();
                }
                catch (err) {
                    console.log(err);
                }
                let pendingHolder = document.createElement("div");
                let clear = document.createElement("button");
                let reject = document.createElement("button");
                clear.setAttribute("type", "button");
                reject.setAttribute("type", "button");
                clear.innerHTML = "Processed Successfully";
                clear.className = "btn btn-success m-1";
                reject.innerHTML = "Reject/Failed to Pickup";
                reject.className = "btn btn-danger m-1"
                reject.addEventListener("click", function () {
                    rejectedRequest(obj.donationID, obj.requestID)
                })
                clear.addEventListener("click", function () {
                    clearRequest(obj.requestID);
                })
                pendingHolder.appendChild(clear);
                pendingHolder.appendChild(reject);
                let requestLi = document.getElementById("request" + obj.requestID);
                requestLi.innerHTML = requestedQuantity + " " + donationName + "<br>Recipient: " + fName + " " + lName + "<br>" + email + "<br><br>In Stock (Pending): " + (availableQuantity - requestedQuantity) + " : " + facility;
                requestLi.appendChild(pendingHolder);
            }
        }
    }
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/confirm/request");
    let sessionID = getCookie("sessionID");
    xhr.send(JSON.stringify({ "donationID": donationID, "requestID": requestID, "customerID": customerID, "email": email, "fName": fName, "lName": lName, "requestedQuantity": requestedQuantity, "availableQuantity": availableQuantity, "facility": facility, "city": city, "address": address, "donationName": donationName, "sessionID": sessionID, "optionalMessage": optionalMessage }));
}


const rejectedRequest = function (donationID, requestID) {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadRejectedRequest;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/reject/request");
    let sessionID = getCookie("sessionID");
    xhr.send(JSON.stringify({ "requestID": requestID, "sessionID": sessionID, "donationID": donationID }));
}


const loadRejectedRequest = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response == "success") {
            console.log("REJECTED!")
            console.log('#quantity' + obj.donationID);
            document.querySelector('#request' + obj.requestID).remove();
            let oldQuantity = parseInt(document.querySelector('#quantity' + obj.donationID).innerHTML);
            console.log(oldQuantity);
            console.log(obj.newQuantity);
            console.log(typeof oldQuantity);
            console.log(typeof obj.newQuantity);
            document.querySelector('#quantity' + obj.donationID).innerHTML = (oldQuantity + obj.newQuantity);
        }
    }
}




const clearRequest = function (requestID) {
    console.log("clearing request")
    let xhr = new XMLHttpRequest();
    xhr.onload = loadClearRequest;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("POST", "http://" + window.location.hostname + "/clear/request");
    let sessionID = getCookie("sessionID");
    xhr.send(JSON.stringify({ "requestID": requestID, "sessionID": sessionID }));
}


const loadClearRequest = function () {
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        if (obj.response == "success") {
            document.querySelector('#request' + obj.requestID).remove();
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



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon"
];

function validFileType(file) {
    return fileTypes.includes(file.type);
}
imageInput.addEventListener('change', updateImageDisplay);
function returnFileSize(number) {
    if(number < 1024) {
      return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
      return (number/1048576).toFixed(1) + 'MB';
    }
  }
function updateImageDisplay() {
    while (imagePreview.firstChild) {
        imagePreview.removeChild(imagePreview.firstChild);
    }

    const curFiles = imageInput.files;
    if (curFiles.length === 0) {
        const para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        imagePreview.appendChild(para);
    } else {
        const list = document.createElement('ol');
        imagePreview.appendChild(list);

        for (const file of curFiles) {
            const listItem = document.createElement('li');
            const para = document.createElement('p');
            if (validFileType(file)) {
                para.textContent = `File name ${file.name}, file size ${returnFileSize(file.size)}.`;
                const image = document.createElement('img');
                image.className = "w-100"
                image.src = URL.createObjectURL(file);

                listItem.appendChild(image);
                listItem.appendChild(para);
            } else {
                para.textContent = `File name ${file.name}: Not a valid file type. Update your selection to '.jpg.`;
                listItem.appendChild(para);
            }

            list.appendChild(listItem);
        }
    }
}







document.getElementById("donationSubmit").addEventListener("click", sendPostDonation);