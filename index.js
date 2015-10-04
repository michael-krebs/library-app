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
	response.sendFile(path.resolve(__dirname + '/success.html'));
	
	//generate user info report
	var body = '';
	body += 'Submitted User Info\n';
	body += '\nName:\t' + request.body.name;
	body += '\nEmail:\t' + request.body.email;
	body += '\nPhone No.:\t' + request.body.phone;
	body += '\nLibrary Card No.:\t' + request.body.libraryCard;
	body += '\nContact Method:\t' + request.body.pickupRadio;
	body += '\nSpecific Recommendations:\t' + request.body.specificRecommendation;
	body += '\nEnjoyed Books:'
				+ '\n\t' + request.body.inputBook1
				+ '\n\t' + request.body.inputBook2
				+ '\n\t' + request.body.inputBook3;
	body += '\nFavorite Authors:\t' + request.body.authors;
	body += '\nReasons Enjoyed:\t' + request.body.enjoyed;
	body += '\nDisliked Authors:\t' + request.body.disliked;
	body += '\nCharacter Types:\t' + request.body.characters;
	body += '\nPreferred Genres:\t' + request.body.preferredGenres;
	body += '\nDisliked Genres:\t' + request.body.dislikedGenres;
	body += '\nLimitations:\t' + request.body.limitRadios;
	body += '\nAdditional Info:\t' + request.body.additionalInfo;
	
	// generate mail options for library and user emails
	var mailOptionsLib = {
		from:    'Library App Service <LibAppService@gmail.com>',
		to:      'LibAppService@gmail.com',
		subject: 'User Book List Request',
		text:    body
	};
	/*
	var mailOptionsUser = {
		from:    'Library App Service <LibAppService@gmail.com>',
		to:      request.body.email,
		subject: 'Your Generated Book List',
		text:    body
	};
	*/
	// send generated emails
	mail(emailer, mailOptionsLib);
	//mail(emailer, mailOptionsUser);
});

// start the server
var server = app.listen(process.env.PORT || 9000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
