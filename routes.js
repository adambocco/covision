const util = require("./util");
const fileServer = require('./fileServer');

exports.home = function(req, res, staticPath) {
    fileServer.handleFile(req, res, staticPath + "home.html");
}

exports.register = function(req, res, staticPath) {
    fileServer.handleFile(req, res, staticPath + "register.html");
}

exports.login = function(req, res, staticPath) {
    fileServer.handleFile(req, res, staticPath + "login.html");
}