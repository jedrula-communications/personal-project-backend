const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const routes = ['/posts']; // TODO take from models ?

module.exports = (app, db) => {
  return {
    init() {
      routes.forEach(_pathHandler.bind(null, app, db));
    },
  }
}

function _pathHandler(app, db, path) {
  console.log('path handler for ', path)
  app.route(path)
      .post(_postPathHandler.bind(null, db, path));
      // TODO add other handlers - delete, update, read
}

function _postPathHandler(db, path, req, res) {
  const { model, serializer } = db[path];
  console.log('_postPathHandler req.body', req.body);
  new JSONAPIDeserializer().deserialize(req.body, function (err, data) {
    console.log('deserialized data' , data)
    if (err) throw err; // FIXME handle
    _saveToDb({ model, data }, (saveToDbError, saved) => {
      if (saveToDbError) {
        res.status(500).json(saveToDbError);
      } else {
        const jsonapi = serializer.serialize(saved);
        res.status(201).json(jsonapi);
      }
    });
  });
}

function _saveToDb(options, callback) {
  const { model, data } = options;
  const instance = new model(data);
  instance.save(callback);
}
