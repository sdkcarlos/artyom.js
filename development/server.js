/**
 * This script starts a https server accessible at https://localhost:8443
 * to test artyom functionalities easily without setup an apache server
 *
 * @author Carlos Delgado
 */

var fs    = require('fs');
var http  = require('http');
var https = require('https');
var path  = require("path");

// Public Self-Signed Certificates for HTTPS connection
var privateKey  = fs.readFileSync('./development/certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('./development/certificates/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// For http
httpServer.listen(8080);
// For https
httpsServer.listen(8443);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/templates/index.html'));
});

// Expose the artyom-source folder
app.use('/source', express.static('./development/artyom-source'))
