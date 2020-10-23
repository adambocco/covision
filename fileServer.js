const fs = require('fs');
const pathModule = require('path');
const util = require('./util');

exports.handleFile = function(req, res, path) {
	let extension = pathModule.extname(path);
	console.log(extension);
	fs.readFile(path, (err, data) => {
		if (err) {
			handleError(res, err, path);
		} else {
			switch (extension) {
				case '.jpg': util.sendData(res, data, 'image/jpg', 200);
					break;
				case '.html': util.sendData(res, data, 'text/html', 200);
					break;
				case '.js': util.sendData(res, data, 'text/javascript', 200);
					break;
				case '.css': util.sendData(res, data, 'text/css', 200);
					break;
				case '.txt': util.sendData(res, data, 'text/plain', 200);
					break;
				case '.ico': util.sendData(res, data, 'image/vnd.microsoft.icon', 200);
					break;
				default: util.sendData(res, 'Choose a route', 'plain/text', 200);
			}
		}
	}
)};
function handleError(res, err, path) {
	console.log('ERROR ON PATH ' + path + "\n" + "ERROR: " +err);
	util.sendData(res, '<h3>Content \'' + path +'\' doesn\'t exist</h3', 'text/html', 404);
}
