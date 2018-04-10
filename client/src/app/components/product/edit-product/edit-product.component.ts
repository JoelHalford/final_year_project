import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';		//enables capture of URL

import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  checker;
  checkerClass;
  currentUrl;
  loading = true;
  product;

  constructor(
  	private location: Location,
  	private ActivatedRoute: ActivatedRoute,
  	private productService: ProductService,
  	private router: Router
  ) { }

  updateProductSubmit() {
	//submit updated product
	this.productService.editProduct(this.product).subscribe(data => 
	{
		if (!data.success)
		{//if data processing is unsuccessful, display warning message
			this.checkerClass = 'alert alert-danger';
			this.checker = data.message;
		}
		else
		{//if data processing is successful, display success message
			this.checkerClass = 'alert alert-success';
			this.checker = data.message;
		}
	});
  }

  goBack() {
    setTimeout(() =>
    {//goes back to previous page
      this.location.back();
    }, 50);
  }

  ngOnInit() 
  {//grabs the current url through the params
  	this.currentUrl = this.ActivatedRoute.snapshot.params;
  	this.productService.getSingleProduct(this.currentUrl.id).subscribe(data => {
  		if (!data.success)
  		{
  			this.checkerClass = 'alert alert-danger';
  			this.checker = 'Product not found.';
  		} 
  		else
  		{
  			this.product = data.product;
  			this.loading = false;
  		}
  	});
  }

}
