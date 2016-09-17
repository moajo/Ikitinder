var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var async = require("async");

app.listen(app.get('port'), function () {
  console.log('Node app is running');
});
