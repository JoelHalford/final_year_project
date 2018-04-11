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
  id;                 //the users ID
  overallLikes = 0;   //users overall likes
  productPosts = [];  //array of product posts
   likeLevel = 0;     //like level to be added to user level
  postLevel = 0;      //post level to be added to user level
  userLevel = 0;      //user level is like level and post level combined
  userTitle = "";     //title of user depending on their level

  constructor(
  		private authService: AuthService,
      private productService: ProductService
  	) { }

  ngOnInit() 
  {//on initialisation, place username into profile
  	this.authService.getProfile().subscribe(profile => 
    {//subscribe to getProfile service inside /services/auth.service
      //set logged in user to username
      this.id = profile.user._id;
  		this.username = profile.user.username;
      //call getAllProducts
      this.getAllProducts();
    });
  }

  getAllProducts() 
  {//gets all products for logged in user
    this.productService.getAllProducts().subscribe(data => 
    {//subscribe to getProfile service inside /services/product.service
      setTimeout(() => 
        {//set a timeout of 50ms
        for (let i = 0; i < data.products.length; i++)
        {//loop through products
          if (data.products[i].createdBy == this.username)
          {//if current product creator equals logged in username
            //add current product to productPosts
            this.productPosts.push(data.products[i]);
            //add current product likes to overall likes
            this.overallLikes += data.products[i].likes;
          }
        }
        this.likeLevel = this.overallLikes * 2;
        this.level(this.likeLevel);
      }, 50);
    });
  }

  numOfPosts()
  {//returns the length of productPosts
    this.postLevel = this.productPosts.length;
    return this.productPosts.length;
  }

  level(likes)
  {//
    this.postLevel = this.numOfPosts();
    this.userLevel = (this.postLevel + likes) / 5;
    if (this.userLevel < 0)
    {
      this.userLevel = 0;
    }
    if (this.userLevel >= 0 && this.userLevel <= 5)
    {
      this.userTitle = "Noobie";
    }
    else if (this.userLevel >= 6 && this.userLevel <= 20)
    {
      this.userTitle = "Scout";
    }
    else if (this.userLevel >= 21 && this.userLevel <= 50)
    {
      this.userTitle = "Warrior";
    }
    else if (this.userLevel >= 51)
    {
      this.userTitle = "Legendary";
    }
  }
}
