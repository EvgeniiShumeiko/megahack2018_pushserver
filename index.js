
const PORT = process.env.PORT || 3000;
const API_URL = 'https://invalids.herokuapp.com';


const fs = require('fs'),
    credentials = {
	cert: fs.readFileSync('/etc/letsencrypt/live/go.k.nammm.ru/fullchain.pem'),
	key: fs.readFileSync('/etc/letsencrypt/live/go.k.nammm.ru/privkey.pem')
    },
    app = require('express')(),
    https = require('https'),
    httpsServer = https.createServer(credentials, app),
    io = require('socket.io')(httpsServer),
    axios = require('axios')


io.sockets.on('connection', function(client){
    client.on('authorize', function(data) {
         var d = JSON.parse(data);
         axios.get(`${API_URL}/account/info`,
              {headers :{ authorization: d.session } })
         .then(res => {
	     //console.log(res.data)
	     console.log(d)
	     if (res.data.login = d.login){
	        console.log(res.data) 
		return client.join(res.data.login);
	     }
	     client.disconnect();
         })
         .catch((err) => {
	     console.log(err);
      	     client,disconnect();
         });
    });
    
    client.on('up', function(message){
    	try{
	    console.log(message);
	    var d = JSON.parse(message)
	    console.log(d.login);
	    client.broadcast.to(d.login).emit('up', message)
   	} catch (e) {
	    console.log(e)
	    client.disconnect();
	}
     });
});


httpsServer.listen(PORT, function(){
	console.log('Server start on '+ PORT);
});
