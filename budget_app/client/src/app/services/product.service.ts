import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http'; //communicate with backend

@Injectable()
export class ProductService {

  options;
  domain = this.authService.domain;


  constructor(
  	private authService: AuthService,
  	private http: Http
  ) { }


  //enables users to access specific areas
  createAuthHeaders() {
  	this.authService.grabToken();
  	//header config options
  	this.options = new RequestOptions({
  	  headers: new Headers({
  		'Content-Type': 'application/json',
  		'auth': this.authService.authToken
  	  })
  	});
  }

  newProduct(product) {
  	this.createAuthHeaders();
  	return this.http.post(this.domain + 'product/newProduct', product, this.options).map(res => res.json());
  }

  getAllProducts() {
    this.createAuthHeaders();
    return this.http.get(this.domain + 'product/allProducts', this.options).map(res => res.json());

  }

}
