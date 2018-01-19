//drive-api
var express = require('express');

const app = express();
let accessToken;
app.use(express.static('public'));


app.get('/test', function (req, res) {
	var jsn = {} 
	var data = 'data';
	jsn[data] = []; 
	
	
	var photo = {
			type: 'photo',
			id: '1',
			user: '1450632410296',
			url: 'https://www.google.se/search?q=nadadores&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjIx9-QneTYAhUK1ywKHX7dBvYQ_AUICigB&biw=1226&bih=688&dpr=2#imgrc=20qQ0orUe3O7PM:',
			guid:'1asdq6',
			mimeType:'image/jpeg'
			

	};
	var photo2 = {
		type: 'photo',
		id: '3',
		user: '145063272542',
		url: 'https://www.google.se/search?q=nadadores&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjIx9-QneTYAhUK1ywKHX7dBvYQ_AUICigB&biw=1226&bih=688&dpr=2#imgrc=20qQ0orUe3O7PM:',
		guid:'1450632asd496',
		mimeType:'image/jpeg'
	};
	jsn[data].push(photo);
	jsn[data].push(photo2);
	res.send(jsn);
});


app.listen(3000);
console.log("Listening on localhost:3000")

