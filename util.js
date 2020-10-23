  exports.sendData = function(res, data, type, status) {
	res.writeHead(status, {'Content-Type':type});
	res.write(data);
	res.end();
}