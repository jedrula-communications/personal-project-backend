const config = require('config');
const mongoDbLocation = config.get('mongoDbLocation');//'192.168.0.155:27017/jedrek';
module.exports = {
  mongoDbUrl: `mongodb://${mongoDbLocation}`,
}
