const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchemaPojo = {
    // author    : ObjectId, TODO
    title     : String,
    body      : String,
    category  : String,
    date      : Date
}
// TODO move to seperate file
const PostSchema = new Schema(postSchemaPojo);

module.exports = (options) => {
  const { modelName, path } = options;
  const Post = mongoose.model(modelName, PostSchema);
  return {
    serializer: new JSONAPISerializer(path, {
      attributes: Object.keys(postSchemaPojo),
    }),
    model: Post
  }
}
