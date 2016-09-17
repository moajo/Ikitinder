var express = require('express');
var app = express();

app.listen(app.get('port'), function () {
  console.log('Node app is running');
});
