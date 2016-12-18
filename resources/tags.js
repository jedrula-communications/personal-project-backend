const jsonApi = require("jsonapi-server");
const tagHandler = require("../handlers/tagHandler.js");

const collectionName = "tags";

jsonApi.define({
  resource: collectionName,
  handlers: tagHandler,
  attributes: {
    title: jsonApi.Joi.string(),
  },
});
