var express = require('express');
var app = express();

app.listen(process.env.PORT || 8000, function () {
  console.log('Node app is running');
});

app.get("/", function (req, res) {
  res.send("hello node world!");
})
