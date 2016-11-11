// TODO consider https://www.npmjs.com/package/json-api-mongo-parser
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const routes = ['/posts']; // TODO take from models ?

module.exports = (app, db) => {
  return {
    init() {
      routes.forEach(_pathHandler.bind(null, app, db));
    },
  }
}

function _deserializeReqBody(req, res, next) {
  new JSONAPIDeserializer().deserialize(req.body, function (err, data) {
    if (err) {
      next(err);
    } else {
      req.deserializedBody = data;
      next();
    }
  })
}

function _pathHandler(app, db, path) {
  app.route(path)
      .post(_deserializeReqBody, _postHandler.bind(null, db, path))
      .get(_getHandler.bind(null, db, path));
  app.route(`${path}/:id`)
      .delete(_deleteHandler.bind(null, db, path))
      .get(_getHandler.bind(null, db, path))
      .patch(_deserializeReqBody, _patchHandler.bind(null, db, path));
}

function _postHandler(db, path, req, res) {
  const { model, serializer } = db[path];
  _createInDb({ model, data: req.deserializedBody }, (dbError, saved) => {
    if (dbError) {
      res.status(500).json(dbError);
    } else {
      const jsonapi = serializer.serialize(saved);
      res.status(201).json(jsonapi);
    }
  });
}

function _patchHandler(db, path, req, res) {
  const { model, serializer } = db[path];
  const id = req.params.id;
  _updateInDb({ model, data: req.deserializedBody, id }, (dbError, data) => {
    console.log('data', data);
    res.send(501);
  })
}

function _getHandler(db, path, req, res) {
  const { model, serializer } = db[path];
  const id = req.params.id;

  // TODO introduce serializers
  function getDbCallback(dbError, found) {
    if (dbError) {
      res.status(500).json(dbError);
    } else {
      const jsonapi = serializer.serialize(found);
      res.status(200).json(jsonapi);
    }
  }

  if (id) {
    _getFromDb({ model, id }, getDbCallback);
  } else {
    _getCollectionFromDb({ model }, getDbCallback);
  }
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

function _createInDb(options, callback) {
  const { model, data } = options;
  const instance = new model(data);
  instance.save(callback);
}

function _updateInDb(options, callback) {
  const { model, data, id } = options;
  model.update({ _id: id }, data, callback);
}

function _getCollectionFromDb(options, callback) {
  const { model } = options;
  model.find({}, callback);
}

function _getFromDb(options, callback) {
  const { model, id } = options;
  model.findById(id, callback);
}

function _deleteFromDb(options, callback) {
  const { model, id } = options;
  //should I check if we actually found the document to remove ?
  model.remove({_id: id}, callback);
}
