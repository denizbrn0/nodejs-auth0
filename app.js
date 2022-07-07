const express = require("express");
const app = express();
require("dotenv").config();
const { auth } = require("express-openid-connect");
var fs = require("fs");
var http = require("http");
var https = require("https");
var privateKey = fs.readFileSync("certification/key.pem");
var certificate = fs.readFileSync("certification/cert.pem");

var httpServer = http.createServer(app);
var credentials = { key: privateKey, cert: certificate };
var httpsServer = https.createServer(credentials, app);

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "logged in" : "logged out");
});
app.get("/account", (req, res) => {
  res.send(
    req.oidc.isAuthenticated() ? JSON.stringify(req.oidc.user) : "Not logged in"
  );
});

httpServer.listen(8080);
httpsServer.listen(3000);
