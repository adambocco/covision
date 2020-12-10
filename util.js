const nodemailer = require('nodemailer');
exports.sendData = function(res, data, type, status) {
	res.writeHead(status, {'Content-Type':type});
	res.write(data);
	res.end();
}

exports.sendDataWithCookie = function(res, data, type, status, cookie) {
	res.writeHead(status, {'Content-Type':type, 'Set-Cookie':cookie});
	res.write(data);
	res.end();
}


exports.reroute = function (res, route) {
	console.log("REROUTING: " + route)
	res.writeHead(301,{Location: route});
	res.end();
}

exports.sendMail = function(email, subject, body) {
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
		subject: subject,
		html: body
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