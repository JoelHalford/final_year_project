import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  form;
  commentForm;
  checkerClass;
  checker;
  newProduct = false;
  loadingProducts = false;
  processing = false;
  username;
  productPosts;
  additionalComment = [];
  enabledComments = [];
  show = 3;

  constructor(
  	private formBuilder: FormBuilder,
    private authService: AuthService,
  	private productService: ProductService
  ) 
  { 
  	this.createNewProductForm();
    this.addCommentForm();
  }

  createNewProductForm() 
  {//applies validation to new product form
  	this.form = this.formBuilder.group(
    {//validation using form builder
  		product_name: ['', Validators.compose([
  			Validators.required,          //name is required
  			Validators.minLength(4),      //minimum length of 4
  			Validators.maxLength(40),  		//maximum length of 40
  			this.alphaNumericValidation   //uses alphanumericValidation function
  		])],
      //validation for product_price
  		product_price: ['', Validators.compose([
  			Validators.required,      //price is required
  			this.numericValidation    //uses numericValidation function
  		])],
      //validation for product_location
  		product_location: ['', Validators.compose([
  			Validators.required,      //location is required
  			Validators.minLength(1),  //minimum length of 4
  			Validators.maxLength(20)  //maximum length of 20
  		])],
      //validation for product_id
  		product_id: ['', Validators.compose([
  			Validators.required,          //id is required
  			Validators.minLength(1),      //maximum length of 1
  			Validators.maxLength(40),  		//maximum length of 40	
  			this.alphaNumericValidation   //uses alphanumericValidation function
  		])],
  	})
  }



  alphaNumericValidation(controls) 
  {//alphanumeric validation
    //ensures input is only letters or numbers (no special characters)
  	const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
  	if(regExp.test(controls.value)) 
    {
  		return null;
  	} 
    else 
    {
  		return {'alphaNumericValidation': true}
  	}
  }

  numericValidation(controls) 
  {//numeric validation
    //ensures input is only applicable to prices
  	const regExp = new RegExp(/^[1-9]\d{0,7}(?:\.\d{1,4})?$/);
  	if(regExp.test(controls.value)) 
    {
  		return null;
  	} 
    else 
    {
  		return {'numericValidation': true}
  	}
  }

  addCommentForm()
  {//validator for the comment form
    this.commentForm = this.formBuilder.group(
    {
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150)
      ])]
    });
  }

  newProductForm() 
  {//show the new product form
  	this.newProduct = true;
  }

  reloadProducts() 
  {//sets loadingProducts to true 
	this.loadingProducts = true;
  //returns all products
  this.getAllProducts();
	//get all products after 1.5 seconds
	setTimeout(() => 
	{//sets a timeout so users have to wait 3 seconds to push reload again
		this.loadingProducts = false;
	},1500 );
  }

  createComment(id)
  {//user clicks to add a comment
    this.commentForm.reset(); //resets comment form
    this.additionalComment = []; //clear array so one comment is psoted at a time
    this.additionalComment.push(id); //adds comment to the array
  }

  onProductSubmit()
  {//when user submits a new product
  	console.log('Submitted form.');

  	const product = 
    {//create object 'product' with these values
  		product_name: this.form.get('product_name').value,
  		product_price: this.form.get('product_price').value,
  		product_location: this.form.get('product_location').value,
  		product_id: this.form.get('product_id').value,
  		createdBy: this.username
  	}

    this.productService.newProduct(product).subscribe(data => {
      if (!data.success)
      {//if error in data submission
        this.checkerClass = 'alert alert-danger';
        this.checker = data.message;
        this.processing = false;        
      } 
      else 
      {//if no error
        this.checkerClass = 'alert alert-success';  //give success message
        this.checker = data.message;    //send text message
        this.getAllProducts();          //get all products
        setTimeout(() => 
          {//sets a timeout of 1.5 seconds
          this.newProduct = false;  //hide the new product form
          this.processing = false;  //set processing to false
          this.checker = false;     //hide checker message
          this.form.reset();        //reset form for use
        }, 1500);
      }
    });
  }

  getAllProducts() 
  {//gets all current products
    this.productService.getAllProducts().subscribe(data => 
    {
      this.productPosts = data.products;
    });
  }

  resetForm() 
  {//reset form 
  	this.form.reset();
  }  

  goBack() 
  {//reload the current window location
  	window.location.reload();
  }

  likeProduct(id)
  {//if user likes a product
    this.productService.likeProduct(id).subscribe(data =>
    {
      this.getAllProducts();
    });
  }

  newComment(id)
  {//post a new comment to database
    this.disableCommentForm(); //disable the comment form while posting comment
    this.processing = true; //locks the button while submitting
    const comment = this.commentForm.get('comment').value; //grabs comment value
    //save comment to the database
    this.productService.newComment(id, comment).subscribe(data => 
    {
      this.getAllProducts(); //refreshes the purchases to show new data
      const index = this.additionalComment.indexOf(id); //grab index of purchase id to remove to array
      this.additionalComment.splice(index, 1); //remove the id from array
      this.enableCommentForm(); //enable the form
      this.commentForm.reset(); //clear the comment form
      this.processing = false; //allows use of buttons
      if (this.enabledComments.indexOf(id) < 0) 
      {
        this.showComments(id); //show comments on submission
      }
    });
  }

  cancelComment(id)
  {//user cancels posting a comment 
    const index = this.additionalComment.indexOf(id);  //grab index of purchase id
    this.additionalComment.splice(index, 1);  //remove the id from array
    this.commentForm.reset(); //clear the comment form
    this.enableCommentForm(); //enable the form
  }

  enableCommentForm()
  {//enable comment form for use
    this.commentForm.get('comment').enable();
  }

  disableCommentForm()
  {//disable comment form so user can't post
    this.commentForm.get('comment').disable();
  }

  showComments(id)
  {//shows the comments
    this.enabledComments.push(id);
  }

  hideComments(id)
  {//hides the comments
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  ngOnInit() 
  {//on initialisation, assign logged in user to username
  	this.authService.getProfile().subscribe(profile => {
  		this.username = profile.user.username;
  	});
    //grab all products on initialisation
    this.getAllProducts();
  }

  showMore()
  {
    this.show += 5;
  }

  getShow()
  {
    return this.show;
  }
}
