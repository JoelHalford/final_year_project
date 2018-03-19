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
  overallLikes = 0;   //users overall likes
  productPosts = [];  //array of product posts

  constructor(
  		private authService: AuthService,
      private productService: ProductService
  	) { }

  ngOnInit() 
  {//on initialisation, place username into profile
  	this.authService.getProfile().subscribe(profile => 
    {//subscribe to getProfile service inside /services/auth.service
      //set logged in user to username
  		this.username = profile.user.username;
      //call getAllProducts
      this.getAllProducts();
    });
  }

  getAllProducts() 
  {//gets all products
    this.productService.getAllProducts().subscribe(data => 
    {//subscribe to getProfile service inside /services/product.service
      setTimeout(() => 
        {//set a timeout of 50ms
        for (let i = 0; i < data.products.length; i++)
        {//loop through products
          if (data.products[i].createdBy == this.username)
          {//if current product creator equals username
            //add current product to productPosts
            this.productPosts.push(data.products[i]);
            //add current product likes to overall likes
            this.overallLikes += data.products[i].likes;
          }
        }
      }, 50);
    });
  }
  numOfPosts()
  {//returns the length of productPosts
    return this.productPosts.length;
  }
}
