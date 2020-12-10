const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const util = require("./util");
const u = require("util");
const fs = require("./fileServer");
//Create  a connection pool with mySQL server redentials and dataabase name
const connection_pool = mysql.createPool({
  host: "35.243.137.23",
  user: "adambocco",
  password: "csc330",
  database: "Covision",
  connectionLimit: 10,
});

exports.insertProvider = function (res, { email, name, password }) {
  connection_pool.query(
    "SELECT Email FROM Provider WHERE Email=" + connection_pool.escape(email) + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      } else {
        if (select_results.length != 0) {
          util.sendData(res, JSON.stringify({ response: "emailTaken" }), "application/json", 200);
        } else {
          bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
              console.log(err)
            } else {
              connection_pool.query("INSERT INTO Provider (Name, Email, Password) VALUES (" + connection_pool.escape(name) + "," + connection_pool.escape(email) + "," + connection_pool.escape(hash) + ");",
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  util.sendData(res, JSON.stringify({ response: "success" }), "application/json", 200);
                  console.log("New Provider Created: " + email + hash);

                  }
                }
              )
            }
          }
          )
        }
      }
    }
  )
}

exports.insertCustomer = function (res, { first, last, email, password }) {
  connection_pool.query(
    "SELECT Email FROM Customer WHERE Email=" + connection_pool.escape(email) + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      } else {
        if (select_results.length != 0) {
          util.sendData(res, JSON.stringify({ response: "emailTaken" }), "application/json", 200);
        } else {
          bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
              console.log(err)
            } else {
              connection_pool.query("INSERT INTO Customer (FirstName, LastName, Email, Password) VALUES (" + connection_pool.escape(first) + "," + connection_pool.escape(last) + "," + connection_pool.escape(email) + "," + connection_pool.escape(hash) + ");",
                (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    util.sendData(res, JSON.stringify({ response: "success" }), "application/json", 200);
                    console.log("New Customer Created: " + email + hash);
                  }
                }
              )
            }
          }
          )
        }
      }
    }
  )
}

exports.loginProvider = function (res, {email, password }) {
  connection_pool.query(
    "SELECT Provider_ID, Password FROM Provider WHERE Email=" + connection_pool.escape(email) + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      } else {
        if (select_results.length == 0) {
          util.sendData(res, JSON.stringify({ response: "wrongEmail", sessionID: "", userType: "" }), "application/json", 200);
        } else {
          bcrypt.compare(password, select_results[0]["Password"], (err, isMatch) => {
            if (err) {
              console.log(err);
            } else {
              if (isMatch) {
                let uniqueID = '_' + Math.random().toString(36).substr(2, 9);
                connection_pool.query("INSERT INTO Session (SessionID, Provider_ID, Email) VALUES (" + connection_pool.escape(uniqueID) + "," + select_results[0]["Provider_ID"] + "," + connection_pool.escape(email) + ");",
                  (err) => {
                    if (err) {
                    } else {
                      console.log("Successfully logged in: " + email + " with ID: " + uniqueID);
                      util.sendData(res, JSON.stringify({ response: "success", sessionID: uniqueID, userType: "2", "email": email }), "application/json", 200);
                    }
                  })
              } else {
                util.sendData(res, JSON.stringify({ response: "wrongPassword", sessionID: "", userType: "" }), "application/json", 200);
              }
            }
          });
        }
      }
    }
  );
};


exports.loginCustomer = function (res, { email, password }) {
  connection_pool.query(
    "SELECT Customer_ID, Password FROM Customer WHERE Email=" + connection_pool.escape(email) + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(select_results[0]);
        if (select_results.length == 0) {
          util.sendData(res, JSON.stringify({ response: "wrongEmail", sessionID: "", userType: "" }), "application/json", 200);
        } else {
          bcrypt.compare(password, select_results[0]["Password"], (err, isMatch) => {
            if (err) {
              console.log(err);
            } else {
              if (isMatch) {
                console.log("Correct password! Logging in: " + email);
                let uniqueID = '_' + Math.random().toString(36).substr(2, 9);
                connection_pool.query("INSERT INTO Session (SessionID, Customer_ID, Email) VALUES (" + connection_pool.escape(uniqueID) + "," + select_results[0]['Customer_ID'] + "," + connection_pool.escape(email) + ");",
                  (err) => {
                    if (err) {
                    } else {
                      console.log("Logged in customer: " + email);
                      util.sendData(res, JSON.stringify({ response: "success", sessionID: uniqueID, userType: "1", "email": email }), "application/json", 200);
                    }
                  })
              } else {
                util.sendData(res, JSON.stringify({ response: "wrongPassword", sessionID: "", userType: "" }), "application/json", 200);
              }
            }
          });
        }
      }
    }
  );
};

exports.deleteSession = function (res, body) {
  connection_pool.query(
    "DELETE FROM Session WHERE SessionID=" + connection_pool.escape(body.sessionID) + ";",
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  )
}


exports.verifySession = function (res, { sessionID }) {
  connection_pool.query(
    "SELECT Email, Provider_ID, Customer_ID FROM Session WHERE SessionID=" + connection_pool.escape(sessionID) + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      } else {
        if (select_results.length == 0) {
          util.sendData(res, JSON.stringify({ response: "loggedOut", sessionID: "", userType: "", email: "" }), "application/json", 200);
        }
        else {
          util.sendData(res, JSON.stringify({
            response: "loggedIn", sessionID: sessionID,
            userType: (select_results[0]["Customer_ID"] !== null ? "1" : "2"), "email": select_results[0]["Email"]
          }),
            "application/json", 200);
        }
      }
    }
  )
}

exports.selectMedical = function (res, query) {
  console.log(query)
  let sqlStr;
  if (query.search != null && query.search != "") {
    sqlStr = "SELECT COUNT(Name) FROM MedicalFacility WHERE (Name LIKE '%"+query.search+"%' OR Info LIKE '%"+query.search+"%');"
  } else {
    sqlStr = "SELECT COUNT(Name) FROM MedicalFacility;"
  }
  connection_pool.query(sqlStr,
    (err, select_results) => {
      if (err) {
        console.log(err);
      }
      else {
        let page = parseInt(query.page)
        let lowerLimit = (page-1)*5;
        let upperLimit = (page)*5;
        console.log("LOWERLIMIT: ",lowerLimit)
        console.log("UPPERLIMIT: ",upperLimit)

        let sqlString;
        if (query.search != null && query.search != "") {
          sqlString = "SELECT Name, City, Address, Phone, Hours, Info FROM MedicalFacility WHERE (Name LIKE '%"+query.search+"%' OR Info LIKE '%"+query.search+"%') LIMIT "+lowerLimit+","+upperLimit+";";
        } else {
          sqlString = "SELECT Name, City, Address, Phone, Hours, Info FROM MedicalFacility LIMIT "+lowerLimit+","+upperLimit+";"
        }

        connection_pool.query(sqlString,
        (err, select_results2)=> {
          if (err) {console.log(err)} else {
            let ct = select_results[0]['COUNT(Name)'];
            util.sendData(res, JSON.stringify({'data':select_results2,'count':ct}), 'application/json', 200);
          }
        })
      }
    }
  )
}


exports.selectTesting = function (res, query) {
  console.log(query)
  let sqlStr;
  if (query.search != null && query.search != "") {
    sqlStr = "SELECT COUNT(Name) FROM TestingFacility WHERE (Name LIKE '%"+query.search+"%' OR Info LIKE '%"+query.search+"%');"
  } else {
    sqlStr = "SELECT COUNT(Name) FROM TestingFacility;"
  }
  connection_pool.query(sqlStr,
    (err, select_results) => {
      if (err) {
        console.log(err);
      }
      else {
        let page = parseInt(query.page)
        let lowerLimit = (page-1)*5;
        let upperLimit = (page)*5;
        console.log("LOWERLIMIT: ",lowerLimit)
        console.log("UPPERLIMIT: ",upperLimit)

        let sqlString;
        if (query.search != null && query.search != "") {
          sqlString = "SELECT Name, City, Address, Phone, Hours, Info FROM TestingFacility WHERE (Name LIKE '%"+query.search+"%' OR Info LIKE '%"+query.search+"%') LIMIT "+lowerLimit+","+upperLimit+";";
        } else {
          sqlString = "SELECT Name, City, Address, Phone, Hours, Info FROM TestingFacility LIMIT "+lowerLimit+","+upperLimit+";"
        }

        connection_pool.query(sqlString,
        (err, select_results2)=> {
          if (err) {console.log(err)} else {
            let ct = select_results[0]['COUNT(Name)'];
            util.sendData(res, JSON.stringify({'data':select_results2,'count':ct}), 'application/json', 200);
          }
        })
      }
    }
  )
}


exports.insertFacility = function (res, { type, name, city, address, phone, hours, info, donating, sessionID }) {
  console.log("DONATING? : " + donating);
  console.log("DONATING TYPE: " + (typeof donating));
  connection_pool.query("SELECT Name FROM "+type+" WHERE Name=" + connection_pool.escape(name) + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      } else {
        if (select_results.length == 0) {
          connection_pool.query("SELECT Provider_ID FROM Session WHERE SessionID=" + connection_pool.escape(sessionID) + ";",
            (err, select_results2) => {
              if (err) {
                console.log(err);
              }
              else {
                if (select_results2.length != 0 && select_results2[0]["Provider_ID"] != null && select_results2[0]["Provider_ID"] != "") {
                  let provider_ID = select_results2[0]["Provider_ID"]
                  if (type == "MedicalFacility") {
                    connection_pool.query("INSERT INTO MedicalFacility (Name, City, Address, Phone, Hours, Info, Donating, Provider_ID) VALUES (" + connection_pool.escape(name) + "," + connection_pool.escape(city) + "," + connection_pool.escape(address) + "," + connection_pool.escape(phone) + "," + connection_pool.escape(hours) + "," + connection_pool.escape(info) + "," + connection_pool.escape(donating) + "," + provider_ID + ");",
                      (err) => {
                        if (err) {
                          console.log(err);
                        }
                      })
                  } else if (type == "TestingFacility") {
                    connection_pool.query("INSERT INTO TestingFacility (Name, City, Address, Phone, Hours, Info, Donating, Provider_ID) VALUES (" + connection_pool.escape(name) + "," + connection_pool.escape(city) + "," + connection_pool.escape(address) + "," + connection_pool.escape(phone) + "," + connection_pool.escape(hours) + "," + connection_pool.escape(info) + "," + connection_pool.escape(donating) + "," + provider_ID + ");",
                      (err) => {
                        if (err) {
                          console.log(err);
                        }
                      })
                  }
                  util.sendData(res, JSON.stringify({ response: "success" }), "application/json", 200);
                }
              }
            }
          )
        }
        else {
          util.sendData(res, JSON.stringify({ response: "nameTaken" }),
            "application/json", 200);
        }
      }
    }
  )
}

exports.getProviderFacilities = function (res, { sessionID, email }) {
  connection_pool.query(
    "SELECT Email, Provider_ID FROM Session WHERE SessionID=" + connection_pool.escape(sessionID) + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      } else {
        if (select_results.length == 0 || select_results[0]["Email"] != email) {
          util.sendData(res, JSON.stringify({ response: "loggedOut" }), "application/json", 200);
        }
        else {
          connection_pool.query("SELECT Name, Med_Facility_ID, Donating FROM MedicalFacility WHERE Provider_ID=" + connection_pool.escape(select_results[0]['Provider_ID']) + ";",
            (err, select_results2) => {
              if (err) {
                console.log(err);
              }
              else {
                connection_pool.query("SELECT Name, Testing_Facility_ID, Donating FROM TestingFacility WHERE Provider_ID=" + connection_pool.escape(select_results[0]['Provider_ID']) + ";",
                  (err, select_results3) => {
                    if (err) {
                      console.log(err);
                    }
                    else {
                      if (select_results2.length == 0 && select_results3.length == 0) {
                        util.sendData(res, JSON.stringify({ response: "noFacilities" }), "application/json", 200);
                      }
                      else {
                        let medFacilities = [];
                        select_results2.forEach((item) => {
                          if (item['Donating'] == true) {
                            medFacilities.push({ "facilityName": item['Name'], "facilityID": item['Med_Facility_ID'] })
                          }
                        })
                        let testFacilities = [];
                        select_results3.forEach((item) => {
                          if (item['Donating'] == true) {
                            testFacilities.push({ "facilityName": item['Name'], "facilityID": item['Testing_Facility_ID'] })
                          }
                        })
                        connection_pool.query("SELECT * FROM Donation WHERE Provider_ID=" + connection_pool.escape(select_results[0]['Provider_ID']) + ";",
                          (err, select_results4) => {
                            if (err) {
                              console.log(err);
                            }
                            else {
                              connection_pool.query("SELECT c.FirstName, c.LastName, c.Customer_ID, d.Name AS DonationName, c.LastName, c.Email, d.Donation_ID, r.Ready, r.Quantity AS QuantityRequested, d.Quantity AS QuantityAvailable, t.Name as FacilityName, r.Request_ID FROM Requests r INNER JOIN Donation d ON d.Provider_ID=r.Provider_ID INNER JOIN Customer c ON r.Customer_ID=c.Customer_ID INNER JOIN TestingFacility t ON r.Provider_ID=t.Provider_ID WHERE r.Provider_ID=" + connection_pool.escape(select_results[0]['Provider_ID']) + " AND d.Donation_ID=r.Donation_ID AND d.Testing_Facility_ID=t.Testing_Facility_ID;",
                                (err, select_results5) => {
                                  if (err) {
                                    console.log(err);
                                  }
                                  else {
                                    connection_pool.query("SELECT c.FirstName, c.LastName, c.Customer_ID, d.Name AS DonationName, c.LastName, c.Email, d.Donation_ID, r.Ready, r.Quantity AS QuantityRequested, d.Quantity AS QuantityAvailable, m.Name as FacilityName, r.Request_ID FROM Requests r INNER JOIN Donation d ON d.Provider_ID=r.Provider_ID INNER JOIN Customer c ON r.Customer_ID=c.Customer_ID INNER JOIN MedicalFacility m ON r.Provider_ID=m.Provider_ID WHERE r.Provider_ID=" + connection_pool.escape(select_results[0]['Provider_ID']) + " AND d.Donation_ID=r.Donation_ID AND d.Med_Facility_ID=m.Med_Facility_ID;",
                                      (err, select_results6) => {
                                        if (err) {
                                          console.log(err);
                                        }
                                        else {
                                          let yourRequests = select_results5.concat(select_results6);
                                          connection_pool.query("SELECT * FROM Message WHERE Provider_ID=" + connection_pool.escape(select_results[0]['Provider_ID']) + ";",
                                            (err, select_results7) => {
                                              if (err) {
                                                console.log(err);
                                              }
                                              else {
                                                util.sendData(res, JSON.stringify({ response: "success", "medFacilities": medFacilities, "testFacilities": testFacilities, "yourDonations": select_results4, "yourRequests": yourRequests, "donatedToYou":select_results7 }), "application/json", 200);
                                              }
                                            }
                                          )
                                        }
                                      })
                                  }
                                }
                              )
                            }
                          })
                      }
                    }
                  }
                )
              }
            })
        }
      }
    }
  )
}

exports.changePassword = function(res, {currentPassword, newPassword, sessionID}){
  connection_pool.query("SELECT Provider_ID FROM Session WHERE SessionID=" + connection_pool.escape(sessionID) + ";",
  (err, select_results1)=>{
    if (err){
      console.log(err);
    }
    else{
      connection_pool.query("SELECT Password FROM Provider WHERE Provider_ID=" + connection_pool.escape(select_results1[0]['Provider_ID']) + ";",
      (err, select_results2)=>{
        if(err){
          console.log(err);
        }
        else{
          bcrypt.compare(currentPassword, select_results2[0]["Password"], (err, isMatch) => {
            if(err){
              console.log(err);
            }
            else{
              if(isMatch){
                bcrypt.hash(newPassword, 10, function (err, hash) {
                  if(err){
                    console.log(err);
                  }
                    else{
                      connection_pool.query("UPDATE Provider SET Password=" + connection_pool.escape(hash) + " WHERE Provider_ID=" + connection_pool.escape(select_results1[0]['Provider_ID']) + ";",
                      (err)=>{
                        if(err){
                          console.log(err);
                        }
                        else{
                          util.sendData(res, JSON.stringify({response:"success"}), "application/json", 200);
                        }
                      });
                    }
              
                });
              }
              else {
                util.sendData(res, JSON.stringify({response: "wrongPassword"}), "application/json", 200);
                }
            }
          });
        }    
      });
    }
  });
}   
exports.selectAccountFacilities = function(res, {sessionID, email}){
  connection_pool.query("SELECT Email, Provider_ID FROM Session WHERE SessionID=" + connection_pool.escape(sessionID) +";",
    (err, select_results)=>{
      if (err){
        console.log(err);
      }
      else {
        if (select_results.length == 0 || select_results[0]["Email"] != email) {
          util.sendData(res, JSON.stringify({response:"loggedOut"}), "application/json", 200);
        }
        else{
          connection_pool.query("SELECT Name, City, Address, Phone, Hours, Info, Donating, Med_Facility_ID FROM MedicalFacility WHERE Provider_ID=" + connection_pool.escape(select_results[0]['Provider_ID']) + ";",
          (err, select_results2)=> {
            if (err) {
              console.log(err);
            }
            else{
              connection_pool.query("SELECT Name, City, Address, Phone, Hours, Info, Donating, Testing_Facility_ID FROM TestingFacility WHERE Provider_ID=" + connection_pool.escape(select_results[0]['Provider_ID']) + ";",
              (err, select_results3)=> {
                if (err) {
                  console.log(err);
                }
                else{
                  let medFacilities = [];
                  select_results2.forEach((item)=> {
                    medFacilities.push({"facilityType": 'medical', "facilityName":item['Name'], "facilityCity": item['City'], "facilityInfo": item['Info'], "facilityAddress": item['Address'], "facilityHours": item['Hours'], "facilityPhone": item['Phone'], "facilityInfo": item['Info'], "facilityDonating": item['Donating'], "facilityID": item['Med_Facility_ID']})
                  })

                  let testFacilities = [];
                  select_results3.forEach((item)=>{
                    testFacilities.push({"facilityType": 'testing', "facilityName":item['Name'], "facilityCity": item['City'], "facilityInfo": item['Info'], "facilityAddress": item['Address'], "facilityHours": item['Hours'], "facilityPhone": item['Phone'], "facilityInfo": item['Info'], "facilityDonating": item['Donating'], "facilityID": item['Testing_Facility_ID']})
                  })

                  util.sendData(res, JSON.stringify({response:"success", "medFacilities": medFacilities, "testFacilities":testFacilities}), "application/json", 200);
               }
              })
            }
          })
        }
        }
    })
}
exports.deleteFacility = function(res, {facilityID, type, donating}){
    let idString = '';
    let tableString = '';
  if(type == 'medical'){
    idString = "Med_Facility_ID";
    tableString = "MedicalFacility";
  }
  else if(type =='testing'){
    idString = "Testing_Facility_ID";
    tableString = "TestingFacility";
  }
  console.log(type + " IS TYPE");
  console.log(donating + " is DONATION VALUE");
    connection_pool.query("SELECT Donation_ID FROM Donation WHERE " + idString  + "=" + connection_pool.escape(facilityID) + ";",
    (err, select_results1) =>{
      if(err){
        console.log(err)
      }
      else{
        console.log("DONATION SELECTION RESULTS:" + JSON.stringify(select_results1));
        if(select_results1.length > 0){
          connection_pool.query("DELETE FROM Donation WHERE Donation_ID=" + connection_pool.escape(select_results1[0]["Donation_ID"]) + ";",
          (err) =>{
            if(err){
              console.log(err);
            }
            else{
              console.log('Donation deletion successful. All donations associated with the account have been deleted.');
            }  
          });
        }
        connection_pool.query("DELETE FROM " + tableString + " WHERE " + idString + "=" + connection_pool.escape(facilityID) + ";",
        (err)=>{
          if(err){
            console.log(err);
          }
          else{
            util.sendData(res, JSON.stringify({response:"success"}), "application/json", 200);
          }
        });
      }
    });
}

//   else if(type == 'testing' && donating == 1){
//     connection_pool.query("SELECT Donation_ID FROM Donation WHERE Testing_Facility_ID=" + connection_pool.escape(facilityID) + ";",
//     (err, select_results1) =>{
//       console.log(select_results1);
//       if(err){
//         console.log(err)
//       }
//       else{
//         if(select_results1.length > 0){
//         connection_pool.query("DELETE FROM Donation WHERE Donation_ID=" + connection_pool.escape(select_results1[0]["Donation_ID"]) + ";",
//         (err, select_results2) =>{
//           if(err){
//             console.log(err);
//           }
//           else{
//             console.log('Donation deletion successful');
//           }
//         })
//         }
//       }
//     })
//   }

//   if(type == 'medical'){
//     console.log(facilityID +" IS CURRENT F ID");
//     connection_pool.query("DELETE FROM MedicalFacility WHERE Med_Facility_ID=" + connection_pool.escape(facilityID) + ";",
//       (err, select_results3) =>{
//       console.log('DELETEING FACILITY RESULTS' + JSON.stringify(select_results3));
//       if(err){
//         console.log(err);
//       }
//       else{
//       util.sendData(res, JSON.stringify({response:"success"}), "application/json", 200);
//       }
//     })
//   }

//   else if(type == 'testing'){
//     connection_pool.query("DELETE FROM TestingFacility WHERE Testing_Facility_ID=" + connection_pool.escape(facilityID) + ";",
//       (err, select_results3) =>{
//       console.log('DELETEING FACILITY RESULTS' + JSON.stringify(select_results3));
//       if(err){
//         console.log(err);
//       }
//       else{
//       util.sendData(res, JSON.stringify({response:"success"}), "application/json", 200);
//       }
//     })
//   }
// }


exports.updateFacility = function(res, {sessionID, facilityID, type, name, city, address, phone, hours, info, donating}){
  if(type == 'medical'){
    connection_pool.query("UPDATE MedicalFacility SET Name=" + connection_pool.escape(name) + ", City=" + connection_pool.escape(city) +
    ", Address=" + connection_pool.escape(address) + ", Phone=" + connection_pool.escape(phone) + ", Hours=" +connection_pool.escape(hours) + ", Info=" +connection_pool.escape(info) + 
    ", Donating=" + connection_pool.escape(donating) + " WHERE Med_facility_ID=" + connection_pool.escape(facilityID) + ";",
    (err, select_results1) =>{
      if (err){
        console.log(err);
      }
      else{
        util.sendData(res, JSON.stringify({response:"success", select_results1}), "application/json", 200);
      }
    })
  }

  else if(type == 'testing'){
    connection_pool.query("UPDATE TestingFacility SET Name= " + connection_pool.escape(name) + ", City=" + connection_pool.escape(city) +
    ", Address=" + connection_pool.escape(address) + ", Phone=" + connection_pool.escape(phone) + ", Hours=" +connection_pool.escape(hours) + ", Info=" +connection_pool.escape(info) + 
    ", Donating=" + connection_pool.escape(donating) + " WHERE Testing_facility_ID=" + connection_pool.escape(facilityID) + ";",
    (err, select_results1) =>{
      if (err){
        console.log(err);
      }
      else{
        util.sendData(res, JSON.stringify({response:"success", select_results1}), "application/json", 200);
      }
    })
  }

}



exports.insertDonation = function(res, body) {
  verifySessionCallback(body, handleDonationInsert, res);
}

const handleDonationInsert = function ({ donationName, quantity, description, facilityName, facilityType, facilityID }, res, provider_ID, customer_ID) {
  console.log("DONATION NAME: " + donationName);
  console.log("QUANTITY: " + quantity);
  console.log("DESCRIPTION: " + description);
  console.log("FACILITY TYPE: " + facilityType);
  console.log("FACILITY ID: " + facilityID);
  console.log("FACILITY NAME: " + facilityName);
  let typeID = facilityType == "M" ? "Med_Facility_ID" : "Testing_Facility_ID";
  console.log("SELECT Name FROM Donation WHERE Name=" + connection_pool.escape(donationName) + " AND Provider_ID=" + provider_ID + ";")
  connection_pool.query("SELECT Name FROM Donation WHERE Name=" + connection_pool.escape(donationName) + " AND Provider_ID=" + provider_ID + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      }
      else {
        if (select_results.length == 0) {
          connection_pool.query("INSERT INTO Donation (Quantity, Name, Description, Provider_ID, " + typeID + ") VALUE (" + connection_pool.escape(quantity) + "," + connection_pool.escape(donationName) + "," + connection_pool.escape(description) + "," + provider_ID + "," + parseInt(facilityID) + ");",
            (err, result) => {
              if (err) {
                console.log(err);
              }
              else {
                util.sendData(res, JSON.stringify({ response: "success", "donationName": donationName, "quantity": quantity, "description": description, "facilityName": facilityName, "insertedID": result.insertId }), "application/json", 200);
              }
            })
        }
        else {
          util.sendData(res, JSON.stringify({ response: "nameTaken" }), "application/json", 200);
        }
      }
    }
  )
}

exports.insertImage = function(res, uniqueID, donationID) {
  connection_pool.query("UPDATE Donation SET ImageID="+connection_pool.escape(uniqueID)+" WHERE Donation_ID="+connection_pool.escape(donationID)+";",
  (err)=> {
    if (err) {
      console.log(err);
    } else {
      util.sendData(res, JSON.stringify({response:"success", 'uniqueID': uniqueID}), "application/json", 200);
    }
  })
}

const verifySessionCallback = function (body, cb, res) {
  connection_pool.query(
    "SELECT Email, Provider_ID, Customer_ID FROM Session WHERE SessionID=" + connection_pool.escape(body.sessionID) + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      } else {
        if (select_results.length == 0) {
          util.sendData(res, JSON.stringify({ response: "loggedOut" }), "application/json", 200);
        }
        else {
          let provider_ID = parseInt(select_results[0]["Provider_ID"]);
          let customer_ID = parseInt(select_results[0]["Customer_ID"]);
          console.log("SESSION VERIFIED FOR DONATION DELETE");
          cb(body, res, provider_ID, customer_ID);
        }
      }
    }
  )
}

exports.confirmRequest = function (res, body) {
  verifySessionCallback(body, handleConfirmRequest, res);
}

const handleConfirmRequest = function ({ donationID, requestID, email, fName, lName, requestedQuantity, availableQuantity, facility, city, address, donationName, optionalMessage }, res, provider_ID, customer_ID) {
  console.log("Confirming request");
  connection_pool.query("UPDATE Donation SET Quantity = Quantity-" + parseInt(requestedQuantity) + " WHERE Donation_ID=" + parseInt(donationID) + ";",
    (err) => {
      if (err) {
        console.log("CHECK HERE FOR DONATION QUANTITY UPDATE");
        console.log(err);
      }
      else {
        connection_pool.query("UPDATE Requests SET Ready=1 WHERE Request_ID=" + parseInt(requestID) + ";",
          (err) => {
            if (err) {
              console.log(err);
            }
            else {
              util.sendData(res, JSON.stringify({ response: "success", "requestID": requestID, "donationID": donationID, "newQuantity": (availableQuantity - requestedQuantity) }), "application/json", 200);
              let mail = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.COVISIONEMAIL,
                  pass: process.env.COVISIONPASS
                }
              });
              let mailOptions = {
                from: process.env.COVISIONEMAIL,
                to: email,
                subject: 'Test email from COVISION',
                html: "<h3>Hello, " + fName + "</h3><p>Your request for " + requestedQuantity + " " + donationName + " is ready for pickup at " + facility + " at " + address + " " + city + ".</p> +<p>"+optionalMessage+"</p>"
              }
              mail.sendMail(mailOptions,
                (err, info) => {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    console.log(info);
                  }
                }
              )

            }
          })
      }
    })
}



exports.removeDonation = function (res, body) {
  verifySessionCallback(body, handleDonationRemove, res);
}

const handleDonationRemove = function ({ donationID }, res, provider_ID, customer_ID) {
  connection_pool.query("DELETE FROM Donation WHERE Donation_ID=" + parseInt(donationID) + " AND Provider_ID=" + parseInt(provider_ID) + ";",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result.affectedRows);
        if (result.affectedRows > 0) {
          util.sendData(res, JSON.stringify({ response: "success", "deletedID": donationID }), "application/json", 200);
        }
        else {
          util.sendData(res, JSON.stringify({ response: "failed" }), "application/json", 200);
        }
      }
    })
}

exports.updateDonation = function (res, body) {
  verifySessionCallback(body, handleDonationUpdate, res);
}

const handleDonationUpdate = function ({ donationID, newQuantity }, res, provider_ID) {
  connection_pool.query("UPDATE Donation SET Quantity=" + parseInt(newQuantity) + " WHERE Donation_ID=" + parseInt(donationID) + " AND Provider_ID=" + parseInt(provider_ID) + ";",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result.affectedRows);
        if (result.affectedRows > 0) {
          util.sendData(res, JSON.stringify({ response: "success", "donationID": donationID, "newQuantity": newQuantity }), "application/json", 200);
        }
        else {
          util.sendData(res, JSON.stringify({ response: "failed" }), "application/json", 200);
        }
      }
    })
}


exports.selectAllDonations = function (res,query) {
  connection_pool.query("SELECT Donation.Donation_ID, Donation.Name AS DonationName, Donation.Quantity, Donation.ImageID, Donation.Description, Donation.Provider_ID, MedicalFacility.Name AS FacilityName, MedicalFacility.Phone AS Phone, MedicalFacility.Address, MedicalFacility.City, MedicalFacility.Med_Facility_ID FROM Donation INNER JOIN MedicalFacility ON Donation.Med_Facility_ID=MedicalFacility.Med_Facility_ID;",
    (err, med_results) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log("MED RESULTS: " + med_results)
        med_results.forEach((e) => { console.log(e) })
        connection_pool.query("SELECT Donation.Donation_ID, Donation.Name AS DonationName, Donation.Quantity, Donation.ImageID, Donation.Description, Donation.Provider_ID, TestingFacility.Name AS FacilityName, TestingFacility.Phone AS Phone, TestingFacility.Address, TestingFacility.City, TestingFacility.Testing_Facility_ID FROM Donation INNER JOIN TestingFacility ON Donation.Testing_Facility_ID=TestingFacility.Testing_Facility_ID;",
          (err, test_results) => {
            if (err) {
              console.log(err)
            }
            else {
              console.log("TEST RESULTS: " + test_results);
              test_results.forEach((e) => { console.log(e) })
              let allDonations = [...med_results, ...test_results]

              let page = parseInt(query.page)
              let lowerLimit = (page-1)*5;
              let upperLimit = (page)*5;
              let pagedDonations = allDonations.slice(lowerLimit,upperLimit);
              let ct = allDonations.length;
              util.sendData(res, JSON.stringify({ response: "success", "allDonations": pagedDonations, "count": ct }), "application/json", 200)
            }
          })
      }
    })
}

exports.processRequestDonation = function (res, body) {
  verifySessionCallback(body, handleRequestDonation, res);
}

const handleRequestDonation = function ({ donationID, quantity, userType, provID }, res, provider_ID, customer_ID) {
  connection_pool.query("SELECT LastReceived FROM Customer WHERE Customer_ID=" + parseInt(customer_ID) + ";",
    (err, select_results) => {
      if (err) {
        console.log(err);
      }
      else {
        let lastReceived = select_results[0]["LastReceived"];
        let restricted = true;
        if (lastReceived != null) {
          let allowedDate = new Date(Date.parse(lastReceived.replace(/-/g, '/')));
          allowedDate.setDate(allowedDate.getDate() + 7)
          let currentDate = new Date();
          console.log("Customer last received PPE on :::: " + allowedDate + " :::: Current date and time ::::" + currentDate + "::::");
          console.log("Allowed? : ", (currentDate.getTime() > allowedDate.getTime()));
          if (currentDate.getTime() > allowedDate.getTime()) {
            restricted = false;
          }
        }
        else {
          restricted = false;
        }
        if (restricted) {
          util.sendData(res, JSON.stringify({ response: "restricted",  "donationID":donationID  }), 'application/json', 200)
        }
        else {
          connection_pool.query("INSERT INTO Requests (Quantity, Provider_ID, Customer_ID, Donation_ID) VALUES (" + parseInt(quantity) + "," + parseInt(provID) + "," + parseInt(customer_ID) + "," + parseInt(donationID) + ");",
            (err, result1) => {
              if (err) {
                console.log(err);
              }
              else {
                connection_pool.query("UPDATE Customer SET LastReceived=CURRENT_TIMESTAMP WHERE Customer_ID=" + parseInt(customer_ID) + ";",
                  (err, result2) => {
                    if (err) {
                      console.log(err);
                    }
                    else {
                      util.sendData(res, JSON.stringify({ response: "success", "donationID":donationID}), 'application/json', 200);
                    }
                  })
              }
            })
        }
      }
    })
}

const cp = mysql.createPool({
  host: "35.243.137.23",
  user: "adambocco",
  password: "csc330",
  database: "Covision",
  connectionLimit: 10,
});

const qy = u.promisify(cp.query).bind(cp);


const selectAccepting = async function (res, query) {
  try {
    let page = parseInt(query.page)
    let lowerLimit = (page-1)*5;
    let upperLimit = (page)*5;
    console.log("upperlimit: ",upperLimit,"  lowerlimit: ",lowerLimit);
    let rows = await qy("SELECT Med_Facility_ID AS FacilityID, Name, City, Address, Phone, Hours, Info, Provider_ID, 'MED' AS Donating FROM MedicalFacility WHERE Donating=1 UNION ALL SELECT Testing_Facility_ID, Name, City, Address, Phone, Hours, Info, Provider_ID, 'TEST' AS Donating FROM TestingFacility WHERE Donating=1;");
    let count = rows.length
    let pageRows = rows.slice(lowerLimit, upperLimit)
    util.sendData(res, JSON.stringify({ "rows": pageRows, "count": count}), 'application/json', 200);
  }catch(err) {console.log(err)}
}
exports.selectAccepting = selectAccepting;



exports.clearRequest = async function(res, { sessionID, requestID }) {
  let session;
  let result;
  try {
    session = await qy("SELECT Provider_ID FROM Session WHERE SessionID=" + cp.escape(sessionID) + ";");
  }
  catch (err) {
    console.log(err);
  }
  if (session.length != 0) {
    try {
      result = await qy("DELETE FROM Requests WHERE Request_ID=" + parseInt(requestID) + ";");
    }
    catch (err) {
      console.log(err);
    }
  }
  util.sendData(res, JSON.stringify({response:"success", "requestID": requestID}), 'application/json', 200);
}


exports.rejectRequest = async function(res, { sessionID, requestID, donationID }) {
  let session;
  let result;
  let quantity;
  let reloadQuantity;
  try {
    session = await qy("SELECT Provider_ID FROM Session WHERE SessionID=" + cp.escape(sessionID) + ";");
  }
  catch (err) {
    console.log(err);
  }
  if (session.length != 0) {
    try {
      quantity = await qy("SELECT Quantity FROM Requests WHERE Request_ID="+parseInt(requestID)+";")
    }
    catch (err) {
      console.log(err);
    }
    try {
      reloadQuantity = await qy("UPDATE Donation SET Quantity=Quantity+"+parseInt(quantity[0]["Quantity"]) + " WHERE Donation_ID="+parseInt(donationID)+";")
    }
    catch (err) {
      console.log(err);
    }
    try {
      result = await qy("DELETE FROM Requests WHERE Request_ID=" + parseInt(requestID) + ";");
    }
    catch (err) {
      console.log(err);
    }
  }
  util.sendData(res, JSON.stringify({response:"success", "requestID":requestID, "donationID": donationID, "newQuantity":(parseInt(quantity[0]["Quantity"]))}), 'application/json', 200);
}



const notifyProvider = async function (res, { senderType, sessionID, senderEmail, providerID, messageBody, facName, id }) {
  console.log("Notifying provider.......");
  console.log(sessionID);
  let sessionRows = await qy("SELECT Email, Provider_ID, Customer_ID FROM Session WHERE SessionID=" + cp.escape(sessionID) + ";");
  if (sessionRows.length != 0) {
    console.log("session here");
    let senderID = sessionRows[0]["Provider_ID"] != null ? sessionRows[0]["Provider_ID"] : sessionRows[0]["Customer_ID"];
    try {
      let messageProvider = await qy("INSERT INTO Message (Body, Provider_ID, Sender_ID, Sender_Type) VALUES (" + cp.escape(messageBody) + "," + parseInt(providerID) + "," + parseInt(senderID) + "," + cp.escape(senderType) + ");");
    }
    catch (err) {
      console.log(err);
    }

    util.sendData(res, JSON.stringify({"id": id,"facName":facName}), 'application/json', 200);
  }
}
exports.notifyProviderDonation = notifyProvider;

const deleteMessage = async function({messageID}, res) {
  let clearResults;
  try {
    clearResults = qy("DELETE FROM Message WHERE Message_ID="+ cp.escape(messageID) +";");
  }
  catch (err) {
    console.log(err);
  }
  util.sendData(res, JSON.stringify({response:"success"}), 'application/json', 200); 
}

exports.deleteMessage = deleteMessage;


const sendPasswordReset = async function(res, {email, userType}) {
  let existence, forgotRequest;
  try {
    existence = await qy("SELECT * FROM " + (userType? "Provider" : "Customer") + " WHERE Email="+cp.escape(email)+";");
  }
  catch (err) {
    console.log(err);
  }
  if (existence.length != 0) {
    let uniqueID = '_' + Math.random().toString(36).substr(2, 9);
    try {
      forgotRequest = await qy("INSERT INTO Forgot (Reset_Key, Email, User_Type, UserID, Expiration) VALUES (" + cp.escape(uniqueID) +","+ cp.escape(email) +","+ cp.escape(userType) +","+ cp.escape(existence[0][(userType? "Provider_ID" : "Customer_ID")]) +", NOW() + INTERVAL 48 HOUR);")
      util.sendData(res, JSON.stringify({response:"success", "userType": userType}), 'application/json', 200);
      let resetLink = "http://34.75.63.194/passwordReset?uniqueID="+uniqueID;
      util.sendMail(email, "COVISION Password Reset", "Please follow this link to reset your password: <a href='"+resetLink+"'>" + resetLink +"</a>");
    }
    catch (err) {
      console.log(err);
    }
  }
  else {
    util.sendData(res, JSON.stringify({response: "failed", "userType": userType}), 'application/json', 200);
  }
}
exports.sendPasswordReset = sendPasswordReset;

const resetPassword = async function(q, res) {
  let requested;
  let user;
  let alive;
  let uniqueID = q.uniqueID;
  console.log(q);

  try {
    alive = await qy("DELETE FROM Forgot WHERE Expiration < NOW();")
  }
  catch (err) {
    console.log(err);
  }
  try {
    console.log(uniqueID);
    requested = await qy("SELECT * FROM Forgot WHERE Reset_Key="+cp.escape(uniqueID)+";");
  }
  catch (err) {
    console.log(err);
  }
  let userType = requested[0]["User_Type"];
  if (requested.length != 0) {
    try {
      user = await qy("SELECT * FROM "+(userType=="1"?"Provider":"Customer")+" WHERE "+(userType=="1"?"Provider":"Customer")+"_ID="+requested[0]["UserID"]+";"); 
    }
    catch (err) {
      console.log(err);
    }
  }
  else {
    util.sendData(res, JSON.stringify({response:"failed"}), 'application/json', 200);
  }
  let resetCookie = [`resetType=${userType}; expires=365; path=/;`, `resetUniqueID=${uniqueID}; expires=365; path=/;`, `resetEmail=${user[0]["Email"]}; expires=365; path=/;`, `resetUserID=${requested[0]["UserID"]}; expires=365; path=/;`];
  if (user.length != 0) {
    fs.handleFileWithCookie(res, "./public-html/forgotpassword.html", resetCookie);
  }
}

exports.resetPassword = resetPassword;


const confirmPasswordReset = async function(res, {userID, userType, userEmail, newPassword, uniqueID}) {
  let replacePassword;
  let hash;
  let verify;
  console.log(uniqueID);
  try {
    verify = await qy("SELECT UserID, User_Type FROM Forgot WHERE Reset_Key=" + cp.escape(uniqueID) + ";")
  }
  catch (err) {
    console.log(err);
  }
  if (verify.length != 0) {
    console.log(verify);
    if (verify[0]["UserID"] == userID && verify[0]["User_Type"] == userType) {
      try {
        hash = await bcrypt.hash(newPassword, 10);
      }
      catch (err) {
        console.log(err);
      }

      try {
        let typeString = userType=="1"? "Provider":"Customer";
        replacePassword = await qy("UPDATE "+typeString +" SET Password="+cp.escape(hash)+" WHERE "+typeString+"_ID="+parseInt(userID) + ";")
      }
      catch (err) {
        console.log(err);
      }
      util.sendData(res, JSON.stringify({response:"success"}), 'application/json', 200);
    }
  }
  else {
    util.sendData(res, JSON.stringify({response:"failed"}), 'application/json', 200);
  }
}

exports.confirmPasswordReset = confirmPasswordReset;