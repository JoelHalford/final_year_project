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

  newProduct(product) 
  {//service for posting new product
  	this.createAuthHeaders();
  	return this.http.post(this.domain + 'product/newProduct', product, this.options).map(res => res.json());
  }

  getAllProducts() 
  {//service for getting all products
    this.createAuthHeaders();
    return this.http.get(this.domain + 'product/allProducts', this.options).map(res => res.json());
  }

  getSingleProduct(id) 
  {//service for getting single product
    this.createAuthHeaders();
    return this.http.get(this.domain + "product/singleProduct/" + id, this.options).map(res => res.json());
  }

  editProduct(product) 
  {//service for editing product
    this.createAuthHeaders();
    return this.http.put(this.domain + 'product/updateProduct/', product, this.options).map(res => res.json());
  }

  deleteProduct(id)
  {//service for deleting product
    this.createAuthHeaders();
    return this.http.delete(this.domain + 'product/deleteProduct/' + id, this.options).map(res => res.json());
  }

  getAllUserProducts()
  {
    this.createAuthHeaders();
    return this.http.get(this.domain + 'dashboard/allUserProducts', this.options).map(res => res.json());
  }

}
