'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var iMessage = require('../../index.js');
var im = new iMessage();

var async = require("async");

var ejs = require("ejs");
var http = require('http');
var moment = require('moment');

var app = module.exports = express();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/static"));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/api/data", function (req, res) {
  im.getMessages(function(err, data) {
    res.json(data.map(function(d) {
      d.attributedBody = null
      delete d.attributedBody;
      return d;
    }));
  });
});

app.get("/api/contacts", function (req, res) {
  im.getRecipients(function(err, data) {
    res.json(data.map(function(d) {
      return d;
    }));
  });
});


var port = process.env.PORT || 1200;
var server = http.createServer(app).listen(port, function () {
	console.log("express-imessage on ", server.address().port, app.settings.env);
});
