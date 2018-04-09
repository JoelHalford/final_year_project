var request = require('supertest');
var app = require('./index.js');
mongoose = require('mongoose');
var chai = require('chai'), 
//test http apps
chaiHttp = require('chai-http'); 

chai.use(chaiHttp);
var expect = chai.expect;
//allows use of should (i.e resp.SHOULD.redirectTo(...))
chai.should();

describe('Test Route with Token', function() {

  this.timeout(5000);

  it('Create a normal user', function(done) 
    {//creates a user by passing object to /auth/register
    //sets a user object with username, password, password2  and admin status
    var user = { username : 'UnitTest', password: 'Aa!1aaaa', password2: 'Aa!1aaaa' };
    request(app)
      .post('/auth/register')
      .send(user) //send user object to /auth/register
      //expect a success message saying user has been saved
      .expect({success: true, message: 'User saved'}, done);
  });

  it('Create admin user', function(done) 
    {//creates a user by passing object to /auth/register
    //sets a user object with username, password, password2  and admin status
    var user = { username : 'UnitTest3', password: 'Aa!1aaaa', password2: 'Aa!1aaaa', admin: true };
    request(app)
      .post('/auth/register')
      .send(user) //send user object to /auth/register
      //expect a success message saying user has been saved
      .expect({success: true, message: 'User saved'}, done);
  });  

  it('Login', function(done)
  {//login normal account
    request(app)
      .post('/auth/login')
      .send({username: 'unittest', password: 'Aa!1aaaa'})
      .end(function(err, res) {
        done();
      });
  });

  it('Unable to reach /product/newProduct due to no token', function(done) 
    {//try to visit /product/newProduct
    request(app)
      .post('/product/newProduct')
      .expect({success: false, message: 'No token provided'}, done);
  });

  it('Unable to reach /auth/profile due to no token', function(done) 
  {//try to visit /profile
    request(app)
      .get('/auth/profile')
      .expect({success: false, message: 'No token provided'}, done);
  });

  it('Unable to reach /auth/admin due to no token', function(done) 
  {//try to visit /admin
    request(app)
      .get('/auth/admin')
      .expect({success: false, message: 'No token provided'}, done);
  });   
});

describe('[LOGGED IN]', function() 
{//tests for when user is logged in
  var agent = request.agent('http://localhost:8080');
  var token = ''; //token for 'unittest' account

  this.timeout(5000); //set a custom timeout of 5 seconds

  before(function(done) 
    {//before any tests are run, log in to unit test account created earlier
    agent
      .post('/auth/login')
      .send({username: 'unittest', password: 'Aa!1aaaa'})
      .end(function(err, res) {
        token = res.body.token;
        done();
      });
  });

  it('Can access profile due to being logged in.', function(done) 
  {//try to visit /profile
    request(app)
      .get('/auth/profile')
      .set('auth', token)
      .expect( { success: true, user: {  _id: '5acab83d49fcb655e065b6bc', username: 'unittest' } });
      done();
  });

  it('Unable to access admin page due to not having admin rights.', function(done) 
  {//try to visit /admin
    request(app)
      .get('/auth/admin')
      .set('auth', token)
      .expect( {"success":false,"message":"You are not an admin"});
      done();
  });

  it('Add Product', function(done) 
  {//tries to get access to parties
    agent
    .post('/product/newProduct')      
    .set('auth', token)
    .send({
      product_name: 'UnitTest',
      product_price: 15.20,
      product_location: 'UnitTest',
      product_id: 'JKSF98',
      product_private: "false",
      createdBy: 'unittest'
    })
    .then(function(res) {
      expect(res.body).to.contain({"success":true,"message":"Product created."})
      done();
    })
  }); 

  it('Edit Product', function(done)
  {
    agent
    .put('/product/updateProduct')
    .set('auth', token)
    .send({
      _id: '5acae804330b820eb0bb0873',
      product_name: 'UnitTest2',
      product_price: 55.20,
      product_location: 'UnitTest2',
      product_id: 'JKSF982',
      product_private: "false",
      createdBy: 'unittest'
    })
    .then(function(err, res) {
      done();
    })
  });

  it('Delete Product', function(done)
  {
    agent
    .delete('/product/deleteProduct/:id')
    .set('auth', token)
    .send({
      _id: '5acae4d1cd77f213509051ee'
    })
    .then(function(err, res) {
      done();
    })
  });
})

describe('[ADMIN CHECK]', function() 
{
  var agent = request.agent('http://localhost:8080');
  var token = ''; //token for 'unittest' account

  this.timeout(5000); //set a custom timeout of 5 seconds

  before(function(done) 
  {//before any tests are run, log in to unit test account created earlier
    agent
      .post('/auth/login')
      .send({username: 'unittest3', password: 'Aa!1aaaa'})
      .end(function(err, res) {
        token = res.body.token;
        done();
      });
  }); 

  it('Unable to access admin page due to not having admin rights.', function(done) 
  {//try to visit /admin
    request(app)
      .get('/auth/admin')
      .set('auth', token)
      .expect( {"success":true, "user": {"_id": "5acaecb901a72e53a4c9fab0", "admin": true, "username": "unittest3"}}, done);
  });
});