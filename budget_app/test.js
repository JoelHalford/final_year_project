//allows access to app.js server/database
var app = require('./index.js');
//allows testing of API
var request = require('supertest');
//chai is a test driven development assertion library
var chai = require('chai'), 
//test http apps
chaiHttp = require('chai-http');
var expect = chai.expect;
const jwt = require('jsonwebtoken');
const config = require('./config/database');
const sinon = require('sinon');
chai.use(chaiHttp);
//allows use of should (i.e resp.SHOULD.redirectTo(...))
chai.should();

describe('[NOT LOGGED IN USER TESTING]', function()
{//unit tests for when users are not logged in
  this.timeout(5000);

  it('Create a user', function(done) 
    {//sets a user object with username, password, password2, admin status
    var user = { username : 'UnitTest', password: 'Aa!1aaaa', password2: 'Aa!1aaaa', admin: false };
    request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user) //send user object to /auth/register
      .expect({success: true, message: 'User saved'}, done);
  });

  it('Try to get product/allProducts while not logged in', function(done) 
  {//try to visit /parties
    request(app)
      .get('/product/allProducts')
      .expect({success: false, message: 'No token provided'}, done);
  });

  it('Try to get /auth/profile while not logged in', function(done) 
  {//try to visit /profile
    request(app)
      .get('/auth/profile')
      .expect({success: false, message: 'No token provided'}, done);
  });

  it('Try to get /auth/admin while not logged in', function(done) 
  {//try to visit /admin
    request(app)
      .get('/auth/admin')
      .expect({success: false, message: 'No token provided'}, done);
  });
});

describe('[LOGGED IN USER TESTING]', function() 
{//unit tests for logged in users
	const userCredentials = {
	  username: 'UnitTest', 
	  password: 'Aa!1aaaa'
	}

	const sandbox = sinon.sandbox.create();
	//allows the use of sessions
	var agent = request.agent(app);
	//extends the timout to 5 seconds (default is 2 seconds)
	this.timeout(5000);

  before(function() 
  {//before any tests are run, log in    
    //agent
    sandbox.stub(jwt, 'verify').callsArgWith(2, null, {});

      	chai.request(app)
      	.post('/auth/login')
      	.set('token', 'anything')
        .send(userCredentials)
        //.expect({success: false, message: 'fghgh'}, done());
        .then(function(resp){
        	done();
        })
  })

  after(function()
  {//after tests are run, log out
    sandbox.restore();
  })

  //try to access parties without being logged in but redirects to loginRequired
  describe('VIEW PARTIES // POST A PARTY', function() 
  {//tests for viewing and posting parties
   //  it('Login', function(done) 
   //    {//tries to get access to parties
   //    	chai.request(app)
   //    	.post('/auth/login')
   //    	.set('token', 'anything')
   //      .send(userCredentials)
   //      //.expect({success: false, message: 'fghgh'}, done());
   //      .then(function(resp){
   //      	done();
   //      })
   // });

    it('View profile', function(done) 
      {//tries to get access to parties
      	chai.request(app)
        .get('/auth/profile')      
        .set('token', 'anything')
        .then(function(resp) {
        	expect(resp).to.have.status(200);
        	done();
        }).catch(function(err){
        	throw err;
        })

    });

    it('Add Product', function() 
      {//tries to get access to parties
      	return chai.request(app)
        .post('/product/newProduct')      
        .set('token', 'anything')
        .send({
        	product_name: 'UnitTest',
        	product_price: 15.20,
        	product_location: 'UnitTest',
        	product_id: 'JKSF98',
        	product_private: "false",
        	createdBy: 'UnitTest'
        })
        .then(function(resp) {
        	console.log(resp)
        	expect(resp).to.have.status(200);
        })
    });    
  });
});