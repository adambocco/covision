
const sendLoadDonations = function(currentPage) {
    let xhr = new XMLHttpRequest();
	xhr.onload = loadLoadDonations;
	xhr.onerror = function () {alert("XML Error, No Matches :(")};
    xhr.open("GET", "http://"+ window.location.hostname +"/donations/all?page="+currentPage);
    xhr.send();
}

const loadLoadDonations = function() {
    if (this.status == 200) {
		let obj = JSON.parse(this.responseText);
        if (obj.response == "success") {
            let count = obj.count;
            console.log("COUNT: ", count)
            let donations = obj.allDonations;
            console.log(donations)
            let mainContainer = document.getElementById("donationListings");
            mainContainer.innerHTML = "";
            for (let i = 0; i < donations.length; i++) {
                
                let rootLi = document.createElement("li");
                rootLi.className = "list-group-item m-0 p-0";
                rootLi.id = donations[i]["Donation_ID"];
                rootLi.style = "background-color: #CFEFFF;"
                rootLi.setAttribute("provID", donations[i]["Provider_ID"]);
                let rootContainer = document.createElement("div");
                rootContainer.className = "container m-0 no-gutter";
                let row1 = document.createElement("row");
                row1.className = "row d-flex align-items-center justify-content-center";
                let row2 = document.createElement("row");
                row2.className = "row";
                row2.id = "inputRow"+donations[i]["Donation_ID"];
                let col1 = document.createElement("div");
                col1.className = "col-md text-center m-5";
                let name = document.createElement("div");
                name.innerHTML = donations[i]["DonationName"];
                name.className = "h1";
                col1.appendChild(name);
                let quantitySpan = document.createElement("span");
                quantitySpan.className = "h3 m-2 p-2"
                quantitySpan.id = "quantity"+donations[i]["Donation_ID"]
                quantitySpan.innerHTML = "<p>Available: " + "<span class='' style='color:blue;'>"+donations[i]["Quantity"]+"</span></p>";
                let col2 = document.createElement("div");
                col2.className = "col-md text-center p-0 justify-content-center align-items-center";
                
                let selectButton = document.createElement("button"); 
                selectButton.setAttribute("type", "button");
                selectButton.className = "btn btn-primary p-3";
                selectButton.addEventListener("click", function() {
                    console.log("D-ID: " + donations[i]["Donation_ID"])
                    selectRequestDonation(donations[i]["Donation_ID"]);
                })
                selectButton.innerHTML="Request ";
                selectButton.id = "selectRequest"+donations[i]["Donation_ID"];
                selectButton.style =  "border-radius: 0 15px;font-size:1.3em;"
                let xMark = document.createElement("i");
                xMark.className = "fas fa-plus";
                selectButton.appendChild(xMark);
                let buttonHolder = document.createElement("div");
                buttonHolder.style = "border: 30px solid #39A; border-radius:0px 25px;";
                buttonHolder.className = "text-center p-0 d-inline";
                buttonHolder.id = "holder"+donations[i]["Donation_ID"];
                buttonHolder.appendChild(selectButton);
                col2.appendChild(buttonHolder);
                row1.appendChild(col1);
                row1.appendChild(col2);

                let descriptionCol = document.createElement("div");
                descriptionCol.className = "lead p-0";
                descriptionCol.innerHTML = donations[i]["Description"]
                let facilityCol = document.createElement("div");
                facilityCol.className = "h4 p-0 mt-5";
                let facilityName = donations[i]["FacilityName"];


                facilityCol.innerHTML = facilityName;
                col1.appendChild(descriptionCol);
                col1.appendChild(quantitySpan);
                if (donations[i]["ImageID"] != null && donations[i]["ImageID"] != "") {
                    let image = document.createElement("img")
                    image.src = "./donationImages/"+donations[i]["ImageID"]+".jpg";
                    image.className = "w-auto"
                    image.style = "max-height:200px;";
                    col1.appendChild(image);
                }
                col2.appendChild(facilityCol);

                let addrCity = document.createElement("p");
                addrCity.className = "text-center my-3";
                addrCity.innerHTML = donations[i]["Address"] +"<br>"+ donations[i]["City"];

                let pn = document.createElement("p");
                pn.className = "text-center h5 my-4";
                pn.innerText = "Phone: " + donations[i]["Phone"];

                col2.appendChild(addrCity);
                col2.appendChild(pn);

                rootContainer.appendChild(row1);
                rootContainer.appendChild(row2);
                rootLi.appendChild(rootContainer);
                mainContainer.appendChild(rootLi);            
            }
            window.scrollTo(0,0)
            let pageHolder = document.querySelector('#pagination');
            pageHolder.innerHTML = "";
            for (let i = 1; i <= ((count/5) + (count%5==0?0:1)); i++) {
                console.log(i);
                console.log(count/5)
                let pageButton = document.createElement('button');
                pageButton.type="button";
                pageButton.className = "btn btn-info m-2";
                pageButton.setAttribute('page', i)
                pageButton.innerHTML = i;

                pageButton.addEventListener("click", (ev)=> {
                    let page = ev.currentTarget.getAttribute('page');
                    sendLoadDonations(page);
                })
                pageHolder.appendChild(pageButton);
            }
        }
    }
}



const selectRequestDonation = function(donationID) {
    let thisButton = document.getElementById("selectRequest"+donationID);
    let thisHolder = document.getElementById("holder"+donationID);
    if (document.getElementById("submitRequest"+donationID)) {
        document.getElementById("inputRequest"+donationID).remove();
        document.getElementById("submitRequest"+donationID).remove();
        thisHolder.style = "border: 30px solid #39A; border-radius:0px 25px;";
        thisHolder.className = "text-center p-0 d-inline";
        thisButton.innerHTML = "Request ";
        thisButton.className = "btn btn-primary p-3";
        thisButton.style =  "border-radius: 0 15px;font-size:1.3em;"
        let xMark = document.createElement("i");
        xMark.className = "fas fa-plus";
        thisButton.appendChild(xMark);
    }
    else {
        let inp = document.createElement("input");
        inp.setAttribute("type", "number");
        inp.setAttribute("min", "1");
        inp.setAttribute("max", "10");
        inp.id = "inputRequest"+donationID;
        inp.value = "1";
        inp.className = "m-1"
        let submit = document.createElement("button");
        submit.setAttribute("type", "button");
        submit.className = "btn btn-success m-1";
        submit.innerHTML = "Send Request ";
        submit.style = "border-radius: 0 15px;font-size:1.3em;"
        submit.id = "submitRequest"+donationID;
        let subMark = document.createElement("i");
        subMark.className = "fas fa-arrow-circle-right";
        submit.appendChild(subMark);

        submit.addEventListener("click", function(){
            sendRequestDonation(donationID);
        })
        thisHolder.className = "text-center";
        thisHolder.insertBefore(submit, thisHolder.firstChild);
        thisHolder.insertBefore(inp, thisHolder.firstChild);
        thisHolder.style = "";
        thisHolder.className = "text-center mx-1 px-1";

        thisButton.innerHTML = "Cancel ";
        thisButton.className = "btn btn-danger m-2";
        let xMark = document.createElement("i");
        xMark.className = "fas fa-times";
        thisButton.appendChild(xMark);

    }
    
}


const sendRequestDonation = function(donationID){

    let sessionID = getCookie("sessionID");
    let userType = getCookie("userType");
    if (userType != "1" || sessionID == "") {
        alert("Please login as a customer before requesting PPE");
        window.location.replace("http://" + window.location.hostname + "/login")
    }
    else {
        let xhr = new XMLHttpRequest();
        xhr.onload = loadRequestDonation;
        xhr.onerror = function () {alert("XML Error, No Matches :(")};
        xhr.open("POST", "http://"+ window.location.hostname +"/donation/request");
        let providerID = document.getElementById(donationID).getAttribute("provID");
        let quantity = document.getElementById("inputRequest"+donationID).value;
        console.log(providerID, donationID);
        xhr.send(JSON.stringify({"donationID":donationID, "quantity": quantity, "sessionID":sessionID, "userType": userType, "provID": providerID}));
    }
}

sendLoadDonations(1);


const loadRequestDonation = function(){
    console.log("LOADING REQUEST")
    if (this.status == 200) {
        let obj = JSON.parse(this.responseText);
        let donationID = obj.donationID;
        if (obj.response == "success") {
            alert("Successfully requested PPE");
            selectRequestDonation(donationID);
        }
        else if (obj.response == "restricted") {
            alert("Please wait before requesting PPE again")
            selectRequestDonation(donationID);
        }
    }
}