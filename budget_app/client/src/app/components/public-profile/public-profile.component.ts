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
  productNumber = 1;
  posts = 0;
  overallLikes = 0;
  productPosts = [];
  checker;
  checkerClass;
  currentUrl;
  username;
  loggedInUser;
  found = false;

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
  	{
  		if (!data.success)
  		{//if incorrect username is sent, send error message
  			this.checkerClass = 'alert alert-danger';
  			this.checker = "Username does not exist."
  		}
  		else
  		{//if no errors, send data according
  			this.found = true;
  			this.username = data.user.username;
  		}
  	})

    this.authService.getProfile().subscribe(profile => {
      this.loggedInUser = profile.user.username;
    });

    this.getAllProducts();
  }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
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
