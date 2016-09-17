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

app.listen(process.env.Port || 8000, function () {
  console.log("aaa");
});

app.get("/", function (req, res) {


  // 文字列を取得する
  client.get(key, function (err, val) {
    // コールバック
    if (err) return console.log(err);
    // エラーが無ければデータを取得できたということ
    console.log(val);
  });
  res.send("hello node world!");
});
