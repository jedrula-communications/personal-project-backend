const dbuser = 'jedrek';
const dbpassword = process.env.MONGO_PASS;
const mongoDbUrl = `mongodb://${dbuser}:${dbpassword}@ds031628.mlab.com:31628/jedrek`;
var jsonApi = require("jsonapi-server");
var MongoStore = require("jsonapi-store-mongodb");

jsonApi.setConfig({
  port: process.env.PORT || 3000,
  graphiql: true
});
jsonApi.define({
  resource: "posts",
  handlers: new MongoStore({
    url: mongoDbUrl,
  }),
  attributes: {
    // TODO add date
    // TODO add author
    title: jsonApi.Joi.string(),
    category: jsonApi.Joi.string(),
    body: jsonApi.Joi.string(),
  }
});

jsonApi.start();