const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const rateLimit = require("express-rate-limit");
const Progress = require('./Progress');

const app = express();

// Limit requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

const PORT = 8080;

app.use(express.static(__dirname + '/public', {
  dotfiles: 'allow'
}));


const emulatorRouter = require(__dirname + '/Emulator.js');

// Set request headers for accessing API from outside
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Route to emulator
app.use('/emulate', emulatorRouter);


app.get('/progress/:id', function(req, res) {

  const progressify = new Progress(["handling", "rendering", "processing"], req.params.id);

  res.json(progressify.data);
});

const ssl = false;

if (ssl) {
	const credentials = {
		key: fs.readFileSync('/etc/letsencrypt/live/gegen-den-virus.de/privkey.pem', 'utf8'),
		cert: fs.readFileSync('/etc/letsencrypt/live/gegen-den-virus.de/cert.pem', 'utf8'),
		ca: fs.readFileSync('/etc/letsencrypt/live/gegen-den-virus.de/chain.pem', 'utf8')
	};

  https.createServer(credentials, app).listen(PORT);
  console.log('(SSL) Example app listening on port ' + PORT + '!');
}
else {
  http.createServer(app).listen(PORT);
  console.log('(HTTP) Example app listening on port ' + PORT + '!');
}
