import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  productPosts;
  username;
  currentUser = false;
  priceSpent = 0;
  priceBudget = 500;

  constructor(
  	private productService: ProductService,
  	private authService: AuthService
  ) { }

  ngOnInit() 
  {
  	this.authService.getProfile().subscribe(profile => {
  		this.username = profile.user.username;
  	});

    this.getAllUserProducts();
  }

  getAllUserProducts() 
  {
    this.productService.getAllUserProducts().subscribe(data => {
      this.productPosts = data.products;
    });
  }


  // subtract(product_price)
  // {
  // 	console.log(this.totalPrice);
  // 	this.totalPrice = (this.totalPrice - product_price);
  // }

  spending(product_price)
  {
  	this.priceSpent = (this.priceSpent + product_price);
  }

}
