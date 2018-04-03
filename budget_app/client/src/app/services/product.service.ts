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
    console.log(id);
    this.createAuthHeaders();
    return this.http.delete(this.domain + 'product/deleteProduct/' + id, this.options).map(res => res.json());
  }

  likeProduct(id)
  {//service for liking a product
    const productData = { id: id };
    return this.http.put(this.domain + 'product/likeProduct/', productData, this.options).map(res => res.json());
  }

  newComment(id, comment)
  {//service for adding a new comment
    this.createAuthHeaders();
    const productData =
    {
      id: id,
      comment: comment
    }
    return this.http.post(this.domain + 'product/comment', productData, this.options).map(res => res.json());
  }

  getAllBudgets() 
  {//service for getting all products
    this.createAuthHeaders();
    return this.http.get(this.domain + 'dashboard/allBudgets', this.options).map(res => res.json());
  }

  newBudget(budget)
  {//service for adding a new comment
    this.createAuthHeaders();
    return this.http.post(this.domain + 'dashboard/newBudget', budget, this.options).map(res => res.json());
  } 

  editBudget(budget) 
  {//service for editing budget
    this.createAuthHeaders();
    return this.http.put(this.domain + 'dashboard/editBudget', budget, this.options).map(res => res.json());
  }

  getAllUsers() 
  {//service for getting all products
    this.createAuthHeaders();
    return this.http.get(this.domain + 'product/allUsers', this.options).map(res => res.json());
  }
}
