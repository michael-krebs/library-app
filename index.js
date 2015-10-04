/*
Server for Library Book Recommendation Service

Created for the Fall 2015 Hack Upstate Hackathon

Author:		Sam Kriever

Utilizes:	Express 4.0
			Body-Parser
			NodeMailer
*/

var express = require('express');
var nodeMailer = require('nodemailer');
var bodyParser = require('body-parser');
var path = require('path');

// email transporter via SMTP
var emailer = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'LibAppService@gmail.com',
        pass: 'morty999'
    }
});

// send email using transporter with mailOption object
function mail(transporter, mailOptions) {
	transporter.sendMail(mailOptions, function(error, info) {
		if(error) {
			console.log(error);
		} else {
			console.log('Message sent: ' + info.response);
		}
	});
}

// express app
var app = express();

// set up path root (parent of server folder)
app.use(express.static(__dirname));

// set up app to acquire POST data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve the form
app.get('/', function (request, response) {
	response.sendFile(path.resolve(__dirname + '/index.html'));
});

// handle the form logic
app.post('/', function(request, response) {
	response.sendFile(path.resolve(__dirname + '/index.html'));
	
	//generate user info report
	var body = '';
	body += '\nName: ' + request.body.name;
	body += '\nEmail: ' + request.body.email;
	body += '\nPhone No.: ' + request.body.phone;
	body += '\nLibrary Card No.: ' + request.body.libraryCard;
	body += '\nContact Method: ' + request.body.pickupRadio;
	body += '\nSpecific Recommendations: ' + request.body.specificRecommendation;
	body += '\nEnjoyed Books:'
				+ '\n\t' + request.body.inputBook1
				+ '\n\t' + request.body.inputBook2
				+ '\n\t' + request.body.inputBook3;
	body += '\nFavorite Authors: ' + request.body.authors;
	body += '\nReasons Enjoyed: ' + request.body.enjoyed;
	body += '\nDisliked Authors: ' + request.body.disliked;
	body += '\nPreferred Genres' + request.body.preferredGenres;
	body += '\nDisliked Genres:' + request.body.dislikedGenres;
	body += '\nLimitations: ' + request.body.limitRadios;
	body += '\nAdditional Info: ' + request.body.additionalInfo;
	
	// generate mail options for library and user emails
	var mailOptionsLib = {
		from:    'Library App Service <LibAppService@gmail.com>',
		to:      'LibAppService@gmail.com',
		subject: 'User Book List Request',
		text:    body
	};
	var mailOptionsUser = {
		from:    'Library App Service <LibAppService@gmail.com>',
		to:      'LibAppService@gmail.com',
		subject: 'Your Generated Book List',
		text:    body
	};

	// send generated emails
	mail(emailer, mailOptionsLib);
	mail(emailer, mailOptionsUser);
});

// start the server
var server = app.listen(process.env.PORT || 9000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
