'use strict';

function getUserHome() {
  var envVar = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
  return process.env[envVar];
}

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
  res.render("recipients");
});

app.get("/recipients", function (req, res) {
  res.render("recipients");
});

app.get("/messages/:id", function (req, res) {
  res.render("messages");
});

app.get("/attachments/:id", function (req, res) {
  res.render("attachments");
});

app.get("/links/:id", function (req, res) {
  res.render("links");
});

app.get("/api/data", function (req, res) {
  im.getMessages(function(err, data) {
    res.json(data.map(function(d) {
      d.attributedBody = null;
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

app.get("/api/messages/:id", function (req, res) {
  im.getMessagesFromId(req.params.id, function(err, data) {
    res.json(data.map(function(d) {
      d.attributedBody = null;
      delete d.attributedBody;
      return d;
    }));
  });
});

app.get("/api/attachments/:id", function (req, res) {
  im.getAttachmentsFromId(req.params.id, function(err, data) {
    res.json(data.map(function(d) {
      d.attributedBody = null;
      if (d.filename) {
        d.filename = d.filename.replace('~', getUserHome());
      }
      delete d.attributedBody;
      return d;
    }));
  });
});

app.get("/api/links/:id", function (req, res) {
  im.getMessagesFromId(req.params.id, 'http', function(err, data) {
    res.json(data.map(function(d) {
      d.attributedBody = null;
      delete d.attributedBody;
      return d;
    }));
  });
});

app.get("/show/attachments/:id", function (req, res) {
  im.getAttachmentById(req.params.id, function(err, message) {
    if (message && message.filename) {
      res.sendFile(message.filename.replace('~', getUserHome()));
    } else {
      console.log("can't find", message, err)
      res.json(404)
    }
  });
});


var port = process.env.PORT || 1200;
var server = http.createServer(app).listen(port, function () {
	console.log("express-imessage on ", server.address().port, app.settings.env);
});
