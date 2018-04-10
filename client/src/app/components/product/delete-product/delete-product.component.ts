import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit 
{//component class for deletion of products

  checkerClass;
  checker;
  foundProduct = false;
  product;
  currentUrl;

  constructor(
  	private productService: ProductService,
  	private activatedRoute: ActivatedRoute,
  	private router: Router
  ) { }

  ngOnInit() 
  {//on initialisation
  	this.currentUrl = this.activatedRoute.snapshot.params;
  	this.productService.getSingleProduct(this.currentUrl.id).subscribe(data => {
  		if (!data.success)
  		{//if sending of data unsuccessful, throw danger warning
  			this.checkerClass = 'alert alert-danger';
  			this.checker = data.message;
  		}
  		else
  		{//if successful set product to product data
  			this.product = 
  			{
  				product_name: data.product.product_name,
  				product_price: data.product.product_price,
  				product_location: data.product.product_location,
  				product_id: data.product.product_id,
  				createdBy: data.product.createdBy,
  				createdAt: data.product.createdAt
  			}
  			this.foundProduct = true;
  		}
  	});
  }

  deleteProduct()
  {//function for deleting a product
  	this.productService.deleteProduct(this.currentUrl.id).subscribe(data =>
  	{//grabs the current id of the url
  		if (!data.success)
  		{//if sending of data is unsuccessful, throw danger warning
  			this.checkerClass = 'alert alert-danger';
  			this.checker = data.message;
  		}
  		else
  		{//else if successful, throw success warning
  			this.checkerClass = 'alert alert-success';
  			this.checker = data.message;

  			setTimeout(() => 
  			{//redirect back to /products after 2.5 seconds
  				this.router.navigate(['/products']);
  			}, 2500);
  		}
  	});
  }
}
