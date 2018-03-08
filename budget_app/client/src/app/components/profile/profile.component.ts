import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	username; //users username
  overallLikes = 0; //users overall likes
  productPosts = [];

  constructor(
  		private authService: AuthService,
      private productService: ProductService
  	) { }

  ngOnInit() {//on initialisation, place username into profile
  	this.authService.getProfile().subscribe(profile => {
  		this.username = profile.user.username;

      this.getAllProducts();
  });
  }

  getAllProducts() 
  {
    this.productService.getAllProducts().subscribe(data => 
    {
      setTimeout(() => {
      for (let i = 0; i < data.products.length; i++)
      {
        if (data.products[i].createdBy == this.username)
        {
          this.productPosts.push(data.products[i]);
          this.overallLikes += data.products[i].likes;
        }
      }
      }, 50);
    });
  }

  numOfPosts()
  {
    return this.productPosts.length;
  }
}
