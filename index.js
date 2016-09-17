var path = require('path')
var express = require('express');
var redis = require("redis");
var app = express();

var client = redis.createClient();

var key = 'hoge:fuga';
var value = 'piyo';

// 文字列を保存する
client.set(key, value, function () {
  console.log("set");
});

app.listen(process.env.PORT || 8000, function () {
  console.log('Node app is running');
});

app.get("/", function (req, res) {

  res.sendFile(path.join(__dirname + "/index.html"));
});
