
function sendFacilityAJAX(currentPage, searchString) {
    let xhr = new XMLHttpRequest();
    xhr.onload = loadFacilities;
    xhr.onerror = function () { alert("XML Error, No Matches :(") };
    if (searchString != null && searchString != "") {
        let querySearchString = searchString.split().join('+');
        xhr.open("GET", "http://" + window.location.hostname + "/medical/listings?page="+currentPage+"&search="+querySearchString);
    } else {
        xhr.open("GET", "http://" + window.location.hostname + "/medical/listings?page="+currentPage);
    }
    xhr.send();
}
const loadFacilities = function () {
    if (this.status == 200) {
        let container = document.getElementById("medicalFacilityListings");
        container.innerHTML = "";
        let object = JSON.parse(this.responseText);
        let obj = object.data;
        let count = object.count;
        console.log("COUNT: ",count)
        for (listing in obj) {
            let hoursArray = obj[listing].Hours.split(",");
            let tag1 = document.createElement("div");
            tag1.className = "row individualFacility my-3";
            tag1.innerHTML = ` <div class="col-md-6 my-3">
            <h3 class="mx-4 my-4">${obj[listing].Name}</h3>
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
            <p class="lead"> <strong>${obj[listing].Info}</strong>
            </p>
            <h3 class="text-center">Contact</h3>
            <p class="lead text-center">
            <ul class="lead">${obj[listing].City}</ul>
            <ul class="lead">${obj[listing].Address}</ul>
            <ul class="lead">${obj[listing].Phone}</ul>
            </p>
        </div>`

            container.appendChild(tag1);
            window.scrollTo(0,0)
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
                let srch = document.querySelector("#searchInput").value;
                sendFacilityAJAX(page, srch);
            })
            pageHolder.appendChild(pageButton);
        }
    }
}
sendFacilityAJAX(1, null);


let searchButton = document.querySelector('#facilitySearch');

searchButton.addEventListener("click", ()=> {
    let searchString = document.querySelector("#searchInput").value;
    sendFacilityAJAX (1, searchString);
})