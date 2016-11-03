// differentiate between dev and production;
// use: https://www.npmjs.com/package/config
const dbuser = 'jedrek';
const dbpassword = process.env.MONGO_PASS;
const mongoDbUrl = `mongodb://${dbuser}:${dbpassword}@ds031628.mlab.com:31628/jedrek`;
// TODO http://mongoosejs.com/docs/promises.html
const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.connect(mongoDbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'connection opened!'));

module.exports = {
  '/posts': require('./models/posts')({ modelName: 'Post', path: 'posts' }),
}
