const dbuser = 'jedrek';
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const config = require('./config');
const fs = require("fs");
const path = require("path");
// const MONGO_PASS = process.env.MONGO_PASS;
// const dbpassword = MONGO_PASS;
// const mongoDbUrl = `mongodb://${dbuser}:${dbpassword}@ds031628.mlab.com:31628/jedrek`;
const { mongoDbUrl } = config;

const jsonApi = require("jsonapi-server");
const MongoStore = require("jsonapi-store-mongodb");

const { Joi } = jsonApi;

const port = process.env.PORT || 3000;

console.log(`setting port config of jsonApi to ${port}`);
jsonApi.setConfig({
  port,
  graphiql: true
});

// TODO move to seperate file
jsonApi.define({
  resource: "posts",
  handlers: new MongoStore({
    url: mongoDbUrl,
  }),
  attributes: {
    // TODO add date
    author: jsonApi.Joi.one("users"),
    public: Joi.boolean(),
    title: Joi.string(),
    categories: jsonApi.Joi.many('tags'),
    body: Joi.string(),
  },
});

// Load all the resources
fs.readdirSync(path.join(__dirname, "/resources")).filter(function(filename) {
  return /^[a-z].*\.js$/.test(filename);
}).map(function(filename) {
  return path.join(__dirname, "/resources/", filename);
}).forEach(require);

jsonApi.onUncaughtException((request, error) => {
  const errorDetails = error.stack.split('\n')
  console.error(JSON.stringify({
    request,
    error: errorDetails.shift(),
    stack: errorDetails
  }))
})

console.log('starting jsonApi');
jsonApi.start();

