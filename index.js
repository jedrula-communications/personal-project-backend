// https://www.npmjs.com/package/kraken-js
console.log('started');

const express = require('express');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

const db = require('./db');
const router = require('./router')(app, db);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.init();

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 3000;

app.listen(port);
