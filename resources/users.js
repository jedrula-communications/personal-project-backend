const jsonApi = require("jsonapi-server");
const userHandler = require("../handlers/userHandler.js");

const collectionName = "users";
const config = require('../config');
const { mongoDbUrl } = config;

// TODO sha passwords
// TODO do not send password back!

const attributes = {
  identification: jsonApi.Joi.string(),
  password: jsonApi.Joi.string(),
};

jsonApi.define({
  resource: collectionName,
  handlers: userHandler,
  attributes: {
    identification: jsonApi.Joi.string(),
    password: jsonApi.Joi.string(),
    admin: jsonApi.Joi.boolean().meta("readonly"), // TODO test
  },
  searchParams: {
    identification: jsonApi.Joi.string(),
    password: jsonApi.Joi.string(),
  },
});

const MongoClient = require('mongodb').MongoClient;

function connectToMongo(cb) {
  console.log('attempting MongoClient.connect');
  MongoClient.connect(mongoDbUrl, function(err, db) {
    if (!err && db) {
      cb(db);
    } else {
      process.exit(1);
      // setTimeout(() => {
      //   connectToMongo(cb);
      // }, 1000)
    }
  });
}

connectToMongo(function(db) {
  // Create a collection we want to drop later
  const collection = db.collection(collectionName);
  // Create an index on the a field
  collection.createIndex('identification', { w:1, unique: true, dropDups: true }, function(err, indexName) {
    if(err) {
      console.error('create index callback err = ', err);
      console.warn('you probably should delete the duplicated records manually!')
    } else {
      console.log('crated index', indexName);
    }
    db.close();
  });
});
