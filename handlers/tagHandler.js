const MongoStore = require("jsonapi-store-mongodb");
const config = require('../config');
const { mongoDbUrl } = config;

const handler = new MongoStore({
  url: mongoDbUrl,
});

module.exports = handler;
