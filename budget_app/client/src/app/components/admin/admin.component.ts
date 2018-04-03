import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  admin;
  productPosts = [];  //array of product posts
  userPosts = [];  	  //array of user posts
  checker;            //update message
  checkerClass;       //update message class
  username;       //current logged in user

  constructor(
  		private authService: AuthService,
      	private productService: ProductService
  ) { }

  ngOnInit() 
  {//on initialisation, place username into profile
  	this.authService.getAdmin().subscribe(profile => 
    {//subscribe to getProfile service inside /services/auth.service
      //set logged in user to username
      	if (profile.user == undefined)
      	{
  			this.checkerClass = 'alert alert-danger';
  			this.checker = profile.message;
      	}
      	else
      	{
	  		this.username = profile.user.username;
	  		this.admin = profile.user.admin;
		    //call getAllProducts
		    this.getAllProducts();
		    this.getAllUsers();
  		}
    });
  }

  getAllProducts() 
  {//gets all products
    this.productService.getAllProducts().subscribe(data => 
    {//subscribe to getAllProducts service inside /services/product.service
      setTimeout(() => 
        {//set a timeout of 50ms
        for (let i = 0; i < data.products.length; i++)
        {//loop through products
            //add current product to productPosts
            this.productPosts.push(data.products[i]);
            //add current product likes to overall likes
        }
      }, 50);
    });
  }

  getAllUsers() 
  {//gets all products
    this.productService.getAllUsers().subscribe(data => 
    {//subscribe to getAllUsers service inside /services/product.service
      setTimeout(() => 
        {//set a timeout of 50ms
        for (let i = 0; i < data.users.length; i++)
        {//loop through products
            //add current product to productPosts
            this.userPosts.push(data.users[i]);
            //add current product likes to overall likes
        }
      }, 50);
    });
  }

  deleteProduct(_id)
  {//function for deleting a product
  	this.productService.deleteProduct(_id).subscribe(data =>
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
  				this.productPosts = [];
  				this.getAllProducts();
  			}, 2500);
  		}
  	});
  }
}
