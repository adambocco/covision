const http = require('http');
const url = require('url');
const fileServer = require('./fileServer');
const routes = require('./routes');
const os = require('os');

const myserver = http.createServer(function (req, res) {
	console.log("serving: "+req.url);
	let staticPath = './public-html' + url.parse(req.url).pathname;
	let path = url.parse(req.url).pathname;
	let query = url.parse(req.url, true).query;
	switch (path) {
		case '/': routes.home(req, res, staticPath); break;
		case '/register' : routes.register(req, res, staticPath); break;
		case '/login' : routes.login(req, res, staticPath); break;
		case '/login/success' : routes.login(req, res, 'login'); break;
		case '/register/provider' : routes.processRegistrationProvider(req, res); break;
		case '/register/customer' : routes.processRegistrationCustomer(req, res); break;
		case '/register/failed' : routes.register(res, res, './public-html/register'); break;
		case '/login/provider' : routes.providerLogin(req, res); break;
		case '/login/customer' : routes.customerLogin(req, res); break;
		case '/logout' : routes.logout(req, res); break;
		case '/session/check' : routes.checkSession(req, res); break;
		case '/medical' : routes.medical(req, res, staticPath); break;
		case '/medical/listings' : routes.listMedical(res, query); break;
		case '/testing' : routes.testing(req, res); break;
		case '/testing/listings' : routes.listTesting(res, query); break;
		case '/post/facility' : routes.postFacilityPage(req, res); break;
		case '/post/facility/process' : routes.postFacility(req, res); break;
		case '/post/donation/process' : routes.postDonation(req, res); break;
		case '/provider/facilities' : routes.getFacilities(req, res); break;
		case '/provider/account' : routes.listAccountFacilities(req,res); break;
		case '/provider/update' : routes.updateFacility(req, res); break;
		case '/provider/delete' : routes.deleteFacility(req, res); break;
		case '/provider/changepassword' : routes.changePassword(req, res); break;
		case '/delete/donation' :routes.deleteDonation(req, res); break;
		case '/update/donation' :routes.updateDonation(req, res); break;
		case '/donateppe' : routes.donateppe(req,res); break;
		case '/requestppe': routes.requestppe(req,res); break;
		case '/donations/all' :routes.getDonations(res, query); break;
		case '/donation/request' :routes.requestDonation(req, res); break;
		case '/confirm/request' : routes.confirmRequest(req, res); break;
		case '/clear/request' : routes.clearRequest(req, res); break;
		case '/reject/request' : routes.rejectRequest(req, res); break;
		case '/donate/facilities' : routes.getFacilitiesAccepting(res,query); break;
		case '/donation/notification' : routes.donationNotification(req, res); break;
		case '/forgot' : routes.forgotPassword(req, res); break;
		case '/passwordReset': routes.resetPassword(query, res); break;
		case '/reset/confirm' : routes.resetConfirm(req, res); break;
		case '/delete/message' :routes.deleteMessage(query, res); break;
		case '/upload/image' :routes.uploadImage(req, res, query); break;
		default: fileServer.handleFile(req, res, staticPath); break;
	}
});


myserver.listen(80, () => {console.log("Listening on port: 80")});
