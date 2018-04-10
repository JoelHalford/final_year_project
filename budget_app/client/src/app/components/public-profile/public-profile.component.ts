import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component(
{
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit 
{
  overallLikes = 0;   //overall likes of user
  productPosts = [];  //array of product posts
  checker;            //update message
  checkerClass;       //update message class
  currentUrl;         //current url of user
  username;           //username of users profile
  loggedInUser;       //current logged in user
  found = false;      //whether user is found or not

  constructor(
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
  	private productService: ProductService,
  	private activatedRoute: ActivatedRoute
  ) {  }

  ngOnInit() 
  {//on initialisation
  	this.currentUrl = this.activatedRoute.snapshot.params;
  	this.authService.getPublicProfile(this.currentUrl.username).subscribe(data =>
  	{//subscribe to getPublicProfile service inside /services/auth.service
  		if (!data.success)
  		{//if incorrect username is sent, send error message
  			this.checkerClass = 'alert alert-danger';
  			this.checker = "Username does not exist."
  		}
  		else
  		{//if no errors, send data according
  			this.found = true; //set found to true
  			this.username = data.user.username;  //set username to users profile
  		}
  	})

    this.authService.getProfile().subscribe(profile => 
    {//subscribe to getProfile service inside /services/auth.service
      //sets loggedInUser to current user logged in
      this.loggedInUser = profile.user.username;
    });
    //call getAllProducts
    this.getAllProducts();
  }

  ngAfterViewChecked()
  {//after the view is checked, detect changes in view
    this.cdRef.detectChanges();
  }

  getAllProducts() 
  {//get all products
    this.productService.getAllProducts().subscribe(data => 
    {//subscribe to getAllProducts service inside /services/product.service
      setTimeout(() => 
      {//set timeout of 50ms
        for (let i = 0; i < data.products.length; i++)
        {//loop through products
          if (data.products[i].createdBy == this.username)
          {//if current product createdBy is equal to username
            //update overall likes with current products likes
            this.overallLikes += data.products[i].likes;

            if (data.products[i].product_private != "true" || this.loggedInUser == this.username)
            {//if product is not private or logged in user is equal to username of profile
              //add current product to productPosts
              this.productPosts.push(data.products[i]);
            }
          }
        }
      }, 50);
    });
  }

  numOfPosts()
  {//returns number of product posts
    return this.productPosts.length;
  }

}
