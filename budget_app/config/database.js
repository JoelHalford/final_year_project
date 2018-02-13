const crypto = require('crypto').randomBytes(256).toString('hex'); //provides cryptographic functionality

//export config object
module.exports = {
  uri: 'mongodb://localhost:27017/purchases', //database URI and name
  secret: crypto, //crypto-created secret
  db: 'purchases' //database name
}
