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
  checkerClass;
  checker;
  newProduct = false;
  loadingProducts = false;
  processing = false;
  username;
  productPosts;

  constructor(
  	private formBuilder: FormBuilder,
    private authService: AuthService,
  	private productService: ProductService
  ) 
  { 
  	this.createNewProductForm();
  }

  createNewProductForm() 
  {
  	this.form = this.formBuilder.group(
    {
  		product_name: ['', Validators.compose([
  			Validators.required,
  			Validators.minLength(4),
  			Validators.maxLength(40),  			
  			this.alphaNumericValidation
  		])],
  		product_price: ['', Validators.compose([
  			Validators.required,
  			this.numericValidation
  		])],
  		product_location: ['', Validators.compose([
  			Validators.required,
  			Validators.minLength(1),
  			Validators.maxLength(20)
  		])],
  		product_id: ['', Validators.compose([
  			Validators.required,
  			Validators.minLength(1),
  			Validators.maxLength(40),  			
  			this.alphaNumericValidation
  		])],
  	})
  }



  alphaNumericValidation(controls) 
  {
  	const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
  	if(regExp.test(controls.value)) 
    {
  		return null;
  	} else {
  		return {'alphaNumericValidation': true}
  	}
  }

  numericValidation(controls) 
  {
  	const regExp = new RegExp(/^[1-9]\d{0,7}(?:\.\d{1,4})?$/);
  	if(regExp.test(controls.value)) {
  		return null;
  	} else {
  		return {'numericValidation': true}
  	}
  }

  newProductForm() 
  {
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

  createComment()
  {

  }

  onProductSubmit()
  {
  	console.log('Submitted form.');

  	const product = {
  		product_name: this.form.get('product_name').value,
  		product_price: this.form.get('product_price').value,
  		product_location: this.form.get('product_location').value,
  		product_id: this.form.get('product_id').value,
  		createdBy: this.username
  	}

    this.productService.newProduct(product).subscribe(data => {
      if (!data.success)
      {
        this.checkerClass = 'alert alert-danger';
        this.checker = data.message;
        this.processing = false;        
      } else {
        this.checkerClass = 'alert alert-success';
        this.checker = data.message;
        this.getAllProducts();
        setTimeout(() => {
          this.newProduct = false;
          this.processing = false;
          this.checker = false;
          this.form.reset();
        }, 3000);
      }
    });
  }

  getAllProducts() 
  {
    this.productService.getAllProducts().subscribe(data => {
      this.productPosts = data.products;
    });
  }

  resetForm() 
  {
  	this.form.reset();
  }  

  goBack() 
  {
  	window.location.reload();
  }

  ngOnInit() 
  {
  	this.authService.getProfile().subscribe(profile => {
  		this.username = profile.user.username;
  	});

    this.getAllProducts();
  }

}
