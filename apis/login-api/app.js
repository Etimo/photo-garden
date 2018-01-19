//drive-api
var express = require('express');
var google = require('googleapis');
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var CLIENT_ID = "212991127628-8rj19c00v2d1tpl9v3rpd2vd740o6d96.apps.googleusercontent.com";
var client = new auth.OAuth2(CLIENT_ID, '', '');
const app = express();

app.use(express.static('public'));

app.get('/login', function(req, res) {
	    res.sendFile(path.join(__dirname + '/login.html'));
});


app.get('/checktoken',function(req,res){

 //  console.log(client);

 //  console.log(client.generateAuthUrl({
 //    access_type: 'offline',
 //    scope: ['https://www.googleapis.com/auth/app.photos.readonly']
 //  }));

	// client.verifyIdToken(
	// 	key,
	// 	CLIENT_ID,
	// 	function(e, login) {
	// 		var payload = login.getPayload();
	// 		var userid = payload['sub'];
	// 		console.log(login);

 //      client.getToken(key, function (err, tokens) {
 //        // Now tokens contains an access_token and an optional refresh_token. Save them.
 //        console.log('get token res', tokens, err);
 //        if (!err) {
 //          oauth2Client.setCredentials(tokens);
 //        }
 //      });
	// 		//var domain = payload['hd'];
	// 	});
	res.send('I AM IMMORTAL, AND NO MAN CAN BE MY EQUAL!');
});
app.listen(3000);
console.log("Listening on localhost:3000")

module.exports = express();
