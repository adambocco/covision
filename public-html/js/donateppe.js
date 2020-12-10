

function sendFacilityAJAX(currentPage) {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadFacilities;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    xhr.open("GET", "http://" + window.location.hostname + "/donate/facilities?page="+currentPage);
    xhr.send();
}
const loadFacilities = function () {
    if (this.status == 200) {
        let container = document.getElementById("donateFacilityListing");
        container.innerHTML = "";
        let obj = JSON.parse(this.responseText);
        let count = obj.count;
        console.log("COUNT: ",count);
        for (listing in obj.rows) {
            let hoursArray = obj.rows[listing].Hours.split(",");
            let tag1 = document.createElement("div");
            let utilID = (obj.rows[listing].Donating + obj.rows[listing].FacilityID);
            let utilName = obj.rows[listing].Name;
            let providerID = obj.rows[listing].Provider_ID;
            tag1.className = "row individualFacility my-3";
            tag1.innerHTML = ` <div class="col-md-6 my-3">
            <h3 class="mx-4 my-4">${obj.rows[listing].Name}</h3>
            <h4 class="mx-5 my-3">Hours of Operation</h4>
            <div class="col mx-3">
                <table class="table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Day</th>
                            <th scope="col">Hours</th>
                        </tr>
                    </thead>
                    <tbody class="w-100">
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
                <div id="input${utilID}" class="form-group">
                    <button id="${utilID}" type="button" class="btn btn-primary m-4 p-3"> Donate to ${utilName} <i class="fas fa-check"></i></button>
                </div>    
            </div>
        </div>
        <div class="col-md-6 my-5">
            <p class="lead"> <strong>${obj.rows[listing].Info}</strong>
            </p>
            <h3 class="text-center">Contact</h3>
            <p class="lead text-center">
            <ul class="lead">${obj.rows[listing].City}</ul>
            <ul class="lead">${obj.rows[listing].Address}</ul>
            <ul class="lead">${obj.rows[listing].Phone}</ul>
            </p>
        </div>`
            container.appendChild(tag1);
            window.scrollTo(0,0)
            let x = document.getElementById(utilID);
            x.addEventListener("click", function () { donationClicked(utilID, utilName, providerID) });
        }
        let pageHolder = document.querySelector('#pagination');
        pageHolder.innerHTML = "";
        for (let i = 1; i <= ((count/5) + (count%5==0?0:1)); i++) {
            let pageButton = document.createElement('button');
            pageButton.type="button";
            pageButton.className = "btn btn-info m-2";
            pageButton.setAttribute('page', i)
            pageButton.innerHTML = i;

            pageButton.addEventListener("click", (ev)=> {
                let page = ev.currentTarget.getAttribute('page');
                sendFacilityAJAX(page);
            })
            pageHolder.appendChild(pageButton);
        }
    }
}
sendFacilityAJAX(1);

const donationClicked = function (id, facName, providerID) {
    console.log("ID:  " + id);
    console.log("FacilityName: " + facName);
    if (document.getElementById(id) != null) {
        console.log("part1");
        document.getElementById(id).remove();

        let donateSub = document.createElement("button");
        donateSub.setAttribute("type", "button");
        donateSub.id = "sub" + id;
        donateSub.className = "btn btn-info m-2";
        donateSub.innerHTML = "Send ";

        let donateDel = document.createElement("button");
        donateDel.setAttribute("type", "button");
        donateDel.id = "del" + id;
        donateDel.className = "btn btn-danger m-2";
        donateDel.innerHTML = "Cancel ";

        let xmark = document.createElement("i");
        let checkmark = document.createElement("i");
        xmark.className = "fas fa-times";
        checkmark.className = "fas fa-check";

        donateSub.addEventListener("click",function() {sendDonationNotification(id, facName, providerID)});
        donateDel.addEventListener("click",function() {donationClicked(id, facName, providerID)});

        donateSub.appendChild(checkmark);
        donateDel.appendChild(xmark);

        let donateText = document.createElement("textarea");
        donateText.placeholder = "Send a message to the provider such as what will you be donating, how much, or other details you'd like to include...";
        donateText.className = "form-control";
        donateText.id = "donateText"+id;


        document.getElementById("input" + id).appendChild(donateText);
        document.getElementById("input" + id).appendChild(donateSub);
        document.getElementById("input" + id).appendChild(donateDel);

    }
    else {
        console.log("part2");
        
        document.getElementById("del" + id).remove();
        document.getElementById("sub" + id).remove();
        document.getElementById("donateText"+id).remove();
        let donButton = document.createElement("button");
        donButton.className = "btn btn-primary m-4 p-3";
        donButton.setAttribute("type", "button");
        donButton.id = id;
        donButton.innerHTML = `Donate to ${facName} <i class="fas fa-check"></i>`;
        donButton.addEventListener("click", function() {
            donationClicked(id, facName);
        })

        document.getElementById("input" + id).appendChild(donButton);
    }
}

const sendDonationNotification = function(id, facName, providerID) {
    let xhr = new XMLHttpRequest();
	xhr.onload = loadNotificationResult;
	xhr.onerror = function () {alert("XML Error, No Matches :(")};
    xhr.open("POST", "http://"+ window.location.hostname +"/donation/notification");
    let type = getCookie("userType")=="2" ? true : false;
    let sessionID = getCookie("sessionID");
    let email = getCookie("email");
    let msgBody = document.getElementById("donateText"+id).value;
    if (sessionID != "" && sessionID != null && email != "" && email != null) {
        xhr.send(JSON.stringify({"senderType":type, "sessionID": sessionID, "senderEmail": email, "providerID": providerID, "messageBody": msgBody, "facName": facName, "id":id}))
    }
    else {
        window.location.replace("http://" + window.location.hostname + "/login.html")
    }
}
const loadNotificationResult = function() {
    if (this.status == 200) {
        let container = document.getElementById("donateFacilityListing");
        let obj = JSON.parse(this.responseText);
        alert("Successfully notifiied of donation drop-off");
        donationClicked(obj.id, obj.facName);
    }
}