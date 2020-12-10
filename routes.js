const fileServer = require('./fileServer');
const db = require("./dbrequests");
const os = require('os');
const fs = require('fs');
const sharp = require('sharp');

exports.home = function(req, res, staticPath) {
    fileServer.handleFile(req, res, staticPath + "home.html");
}

exports.medical = function(req, res, path) {
    fileServer.handleFile(req, res, "./public-html/medicalfacilities.html");
}
exports.requestppe = function (req, res) {
    fileServer.handleFile(req, res, "./public-html/requestppe.html");
}

exports.donateppe = function (req, res) {
    fileServer.handleFile(req, res, "./public-html/donateppe.html");
}

exports.postFacilityPage = function(req, res, staticPath) {
    fileServer.handleFile(req, res, staticPath + '.html');
}

exports.getDonations = function(res, query) {
    db.selectAllDonations(res, query);
}

exports.listMedical = function(res, query) {
    db.selectMedical(res, query);
}

exports.listTesting = function(res,query) {
    db.selectTesting(res,query);
}

exports.getFacilitiesAccepting = function(res, query) {
    db.selectAccepting(res, query);
}

exports.resetPassword = function (q, res) {
    db.resetPassword(q, res)
}

exports.deleteMessage = function(q, res) {
    db.deleteMessage(q, res);
}

exports.uploadImage = function(req, res, query) {
    data = [];
    req.on('error', (err) => console.log(err)).on('data', chunk => data.push(chunk)).on('end', () => 
        {
            let buffer = Buffer.concat(data)
            let uniqueID = '_' + Math.random().toString(36).substr(2, 9);
            sharp(buffer).resize(300).toFile('./public-html/donationImages/'+uniqueID+'.jpg', (err, info)=> {
                if (err) {console.log(err)}
                else {
                    db.insertImage(res, uniqueID, query.donationID);
                }
            })
        });  
}

exports.donationNotification = function (req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.notifyProviderDonation(res,body);
        });  
}


exports.changePassword = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.changePassword(res,body);
        });  
}

exports.forgotPassword = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.sendPasswordReset(res,body);
        });  
}

exports.resetConfirm = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.confirmPasswordReset(res,body);
        });  
}

exports.confirmRequest = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.confirmRequest(res,body);
        });  
}

exports.getFacilities = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.getProviderFacilities(res,body);
        });  
}

exports.listAccountFacilities = function(req, res){
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.selectAccountFacilities(res, body);
        });
}

exports.updateFacility = function(req, res){
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.updateFacility(res, body);
        });
}

exports.deleteFacility = function(req, res){
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.deleteFacility(res, body);
        });
}

exports.postFacility = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.insertFacility(res,body);
        });  
}

exports.postDonation = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.insertDonation(res,body);
        });  
}

exports.clearRequest = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.clearRequest(res,body);
        });  
}

exports.rejectRequest = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.rejectRequest(res,body);
        });  
}

exports.deleteDonation  = function(req, res) {
    console.log("DELETE DONATION ROUTE");
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            console.log(body);
            db.removeDonation(res,body);
        });  
}

exports.updateDonation = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            console.log(body);
            db.updateDonation(res,body);
        });  
}

exports.requestDonation = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            console.log(body);
            db.processRequestDonation(res,body);
        });  
}

exports.testing = function(req, res, staticPath) {
    fileServer.handleFile(req, res, "./public-html/testingfacilities.html");
}

exports.register = function(req, res, staticPath) {
    fileServer.handleFile(req, res, staticPath + ".html");
}

exports.login = function(req, res, staticPath) {
    fileServer.handleFile(req, res, staticPath + ".html");
}

exports.processRegistrationProvider = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.insertProvider(res,body);
        });  
}

exports.processRegistrationCustomer = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.insertCustomer(res,body);
        });  
}

exports.providerLogin = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.loginProvider(res,body);
        });
}

exports.customerLogin = function (req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.loginCustomer(res,body);
        });
}

exports.logout = function(req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.deleteSession(res,body);
        });
}

exports.checkSession = function (req, res) {
    body = ""
    req.on('error', (err) => console.log(err)).on('data', chunk => body+=chunk).on('end', () => 
        {
            body = JSON.parse(body);
            db.verifySession(res,body);
        });
}
