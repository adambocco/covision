const http = require('http');
const url = require('url');
const fileServer = require('./fileServer');
const queryServer = require('./query');
const util = require('./util');

const myserver = http.createServer(function (req, res) {
	let staticPath = './public-html' + url.parse(req.url).pathname;
	let path = url.parse(req.url).pathname;
	let query = url.parse(req.url, true).query;
	console.log("QUERY: ", query);
	console.log("PATH: " + path);
	console.log("STATIC PATH: " + staticPath);
	switch (path) {
		case '/': routes.home(req, res, staticPath); break;
		case '/search' : routes.register(req, res, staticPath); break;
		default: fileServer.handleFile(req, res, staticPath); break;
	}
});


myserver.listen(80, () => {console.log("Listening on port: 80")});