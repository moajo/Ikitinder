require('dotenv').config();

var path = require('path')
var express = require('express');
// var redis = require("redis");
var session = require('express-session');
var auth = require('./passport');
var pg = require('pg');

var app = express();
var passport = auth.passport;
// var redisClient = redis.createClient();
var pgClient = new pg.Client(process.env.DATABASE_URL);
var pgData = [];
pgClient.connect(function (err) {
  if (err) return pgData.push(["could not connect to postgres", err]);
  pgClient.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) return pgData.push(["error running query", err]);
    console.log(result.rows[0].theTime);
    pgData.push("success");
  });
});
app.set('views', './views')
app.set('view engine', 'jade')



app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: process.env.SECRET }));

app.listen(process.env.PORT || 8000, function () {
  console.log('Node app is running');
});
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', places: 'Hello there!' });
});

app.all("/places", function (req, res) {
  var query = "SELECT * FROM place;";
  pgClient.query(query, function (err, result) {
    if (err) console.log(err);
    res.render('places', { places: JSON.stringify(result.rows) });
  });
});

app.all("/suggestions", function (req, res) {
  var query = "SELECT * FROM place;";
  pgClient.query(query, function (err, result) {
    if (err) console.log(err);
    res.render('suggestions', { places: JSON.stringify(result.rows) });
  });
});

app.all("/matches", function (req, res) {
  var query = "SELECT * FROM place;";
  pgClient.query(query, function (err, result) {
    if (err) console.log(err);
    res.render('matches', { places: JSON.stringify(result.rows) });
  });
});

app.all("/places/:id/:code", function (req, res) {
  res.send(JSON.stringify({
    state: "ok",
  }));
});
app.all("/places/:id/:type/:value", function (req, res) {
  console.log(req.params);
  var id = req.params.id;
  var type = req.params.type;
  var value = req.params.value;
  var userId = passport.session.id;
  if (type === "interest") {
    pgClient.connect(function (err) {
      if (err) return pgData.push(["could not connect to postgres", err]);
      var query = 'INSERT INTO user_place(user_id,place_id,like) VALUES (' + userId + ',' + id + ',' + value + ')';
      console.log(query);
      pgClient.query(query, function (err, result) {
        if (err) return pgData.push(["error running query", err]);
        res.send(JSON.stringify({
          state: "ok",
        }));
        pgData.push("success");
      });
    });
  } else if (type === "match") {

  }
  // res.send(JSON.stringify({
  //   state: "ok",
  // }));
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate(
  'twitter', { successRedirect: '/auth/test', failureRedirect: '/auth/test' }
));


app.all("/test/auth", function (req, res) {
  if (passport.session && passport.session.id) {
    console.log("session ok");
    res.send(JSON.stringify(passport.session.id));
  } else {
    console.log("session ng");
    res.send("ng");
  }
})

app.all("/test/psql", function (req, res) {
  res.send(JSON.stringify(pgData));
})
