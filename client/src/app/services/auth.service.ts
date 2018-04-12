import { Injectable } from '@angular/core';	//dependency injection
import { Http, Headers, RequestOptions } from '@angular/http'; //communicate with backend
import 'rxjs/add/operator/map';		//allows binding			
import { tokenNotExpired } from 'angular2-jwt';	//can check if user is logged in

@Injectable()
export class AuthService 
{
	domain = ""; //dev domain
	authToken;   //contains auth token
	user;        //users object
	options;     //header options 

  constructor(
	private http: Http	//initialise http
  ) { }

  createAuthHeaders() 
  {//enables users to access specific areas
  	this.grabToken();
  	this.options = new RequestOptions({
  	  headers: new Headers({
  		'Content-Type': 'application/json',
  		'auth': this.authToken
  	  })
  	});
  }
  grabToken() 
  {//grabs the users token
  	const token = localStorage.getItem('token');
  	this.authToken = token;
  }  
  registerUser(user) 
  {//register users
  	return this.http.post(this.domain + 'auth/register', user).map(res => res.json());
  }
  login(user) 
  {//login users
  	return this.http.post(this.domain + 'auth/login', user).map(res => res.json());
  }
  logout() 
  {//allows users to logout
  	this.authToken = null;
  	this.user = null;
  	localStorage.clear();
  }
  storeUserData(token, user) 
  {//store user data within local storage
  	localStorage.setItem('token', token);
  	localStorage.setItem('user', JSON.stringify(user));
  	this.authToken = token;
  	this.user = user;
  }
  getProfile() 
  {//retrieves users profile
		this.createAuthHeaders();
		return this.http.get(this.domain + 'auth/profile', this.options).map(res => res.json());
  }
  getAdmin() 
  {//retrieves admins profile
    this.createAuthHeaders();
    return this.http.get(this.domain + 'auth/admin', this.options).map(res => res.json());
  }
  loggedIn() 
  {//checks if user is logged in
  	return tokenNotExpired();
  }
  getPublicProfile(username)
  {//retrieves a users public profile
    this.createAuthHeaders();
    return this.http.get(this.domain + 'auth/publicProfile/' + username, this.options).map(res => res.json());
  }
  deleteUser(id)
  {//service for deleting product
    this.createAuthHeaders();
    return this.http.delete(this.domain + 'auth/deleteUser/' + id, this.options).map(res => res.json());
  }
}
