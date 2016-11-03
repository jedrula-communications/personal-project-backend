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
  app.route(path)
      .post(_postHandler.bind(null, db, path))
      .get(_getHandler.bind(null, db, path));
  app.route(`${path}/:id`)
      .delete(_deleteHandler.bind(null, db, path));
}

function _postHandler(db, path, req, res) {
  const { model, serializer } = db[path];
  new JSONAPIDeserializer().deserialize(req.body, function (err, data) {
    if (err) throw err; // FIXME handle
    _saveToDb({ model, data }, (dbError, saved) => {
      if (dbError) {
        res.status(500).json(dbError);
      } else {
        const jsonapi = serializer.serialize(saved);
        res.status(201).json(jsonapi);
      }
    });
  });
}

function _getHandler(db, path, req, res) {
  const { model, serializer } = db[path];
  _getFromDb({ model, path }, (dbError, found) => {
    if (dbError) {
      res.status(500).json(dbError);
    } else {
      const jsonapi = serializer.serialize(found);
      res.status(200).json(jsonapi);
    }
  });
}

function _deleteHandler(db, path, req, res) {
  const { model, serializer } = db[path];
  const id = req.params.id;
  _deleteFromDb({ model, id }, (dbError, obj) => {
    if (dbError) {
      res.status(500).json(dbError);
    } else {
      res.sendStatus(204);
    }
  });
}

function _saveToDb(options, callback) {
  const { model, data } = options;
  const instance = new model(data);
  instance.save(callback);
}

function _getFromDb(options, callback) {
  const { model, path } = options;
  model.find({}, callback);
}

function _deleteFromDb(options, callback) {
  const { model, id } = options;
  model.remove({_id: id}, callback);
}
