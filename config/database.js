const crypto = require('crypto').randomBytes(256).toString('hex'); //provides cryptographic functionality

module.exports = 
{//export database URI, secret and database name
	//uri: 'mongodb://localhost:27017/purchases', //database URI and name 
  	//uri: 'mongodb://localhost:27017/mock-db', //database URI and name | TESTING
  	uri: 'mongodb://topsup:joel@ds139459.mlab.com:39459/purchases', //database URI and name | PRODUCTION
  	secret: crypto, //crypto-created secret
  	db: 'purchases'//normal and production database name
  	//db: 'mock-db' //mock database name
}
