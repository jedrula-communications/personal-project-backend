const MongoStore = require("jsonapi-store-mongodb");
const config = require('../config');
const { mongoDbUrl } = config;

const handler = new MongoStore({
  url: mongoDbUrl,
});

// TODO add some smarter authentication then simply disabling delete and update

// handler.create = null;
handler.delete = null;
handler.update = null;
// handler.find = null;
// handler.search = null;

module.exports = handler;
