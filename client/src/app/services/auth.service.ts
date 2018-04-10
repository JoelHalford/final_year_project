import { Injectable } from '@angular/core';	//dependency injection
import { Http, Headers, RequestOptions } from '@angular/http'; //communicate with backend
import 'rxjs/add/operator/map';		//allows binding			
import { tokenNotExpired } from 'angular2-jwt';	//can check if user is logged in

@Injectable()
export class AuthService 
{
	domain = "http://localhost:8080/"; //dev domain
	authToken;
	user;
	options;

  constructor(
	private http: Http	//initialise http
  ) { }

  //enables users to access specific areas
  createAuthHeaders() 
  {
  	this.grabToken();
  	this.options = new RequestOptions({
  	  headers: new Headers({
  		'Content-Type': 'application/json',
  		'auth': this.authToken
  	  })
  	});
  }

  //grabs the users token
  grabToken() 
  {
  	const token = localStorage.getItem('token');
  	this.authToken = token;
  }
  //register users
  registerUser(user) 
  {
  	return this.http.post(this.domain + 'auth/register', user).map(res => res.json());
  }

  //login users
  login(user) 
  {
  	return this.http.post(this.domain + 'auth/login', user).map(res => res.json());
  }
  //allows users to logout
  logout() {
  	this.authToken = null;
  	this.user = null;
  	localStorage.clear();
  }
  //stores user data
  storeUserData(token, user) {
	localStorage.setItem('token', token);
	localStorage.setItem('user', JSON.stringify(user));
	this.authToken = token;
	this.user = user;
  }
  //retrieves users profile
  getProfile() 
  {
		this.createAuthHeaders();
		return this.http.get(this.domain + 'auth/profile', this.options).map(res => res.json());
  }
  //retrieves admins profile
  getAdmin() 
  {
    this.createAuthHeaders();
    return this.http.get(this.domain + 'auth/admin', this.options).map(res => res.json());
  }
  //checks if user is logged in
  loggedIn() 
  {
  	return tokenNotExpired();
  }
  //retrieves a users public profile
  getPublicProfile(username)
  {
    this.createAuthHeaders();
    return this.http.get(this.domain + 'auth/publicProfile/' + username, this.options).map(res => res.json());
  }
  //delete a user
  deleteUser(id)
  {//service for deleting product
    this.createAuthHeaders();
    return this.http.delete(this.domain + 'auth/deleteUser/' + id, this.options).map(res => res.json());
  }
}
