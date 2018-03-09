import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  //allows reactive
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  form; //exports form
  checker;     //sends validation message
  checkerClass;   //checks validation
  processing = false;  //disable button
  productPosts = [];
  budgetPosts = [];
  username;
  currentUser = false;
  priceSpent = 0;
  currentBudget;
  currentDate = new Date();
  dateNow;
  yearMonth;
  showPurchases = false;
  showOtherPurchases = false;
  showBudgets = true;
  month;
  year;
  newMonth;
  budgetID = 0;
  budget;

  constructor(
    private formBuilder: FormBuilder,
  	private productService: ProductService,
  	private authService: AuthService
  ) 
  { 
     this.createNewBudgetForm();
  }

  ngOnInit() 
  {
  	this.authService.getProfile().subscribe(profile => {
  		this.username = profile.user.username;
  	});

    this.getDate();
    this.getAllProducts();
    this.getAllBudgets();
    this.getCurrentBudget();
  }

  getAllProducts() 
  {
    this.productService.getAllProducts().subscribe(data => 
    {
      setTimeout(() =>{
      for (let i = 0; i < data.products.length; i++)
      {
        if (data.products[i].createdBy == this.username)
        {
          this.productPosts.push(data.products[i]); 
          this.dateNow = data.products[i].createdAt.substring(0, 7);

          if (this.dateNow == this.yearMonth)
          {
            this.spending(data.products[i].product_price);  
          }
        }
      }
    }, 50);
    });
  }

  getAllBudgets() 
  {
    this.productService.getAllBudgets().subscribe(data => 
    {
      setTimeout(() =>{
      for (let i = 0; i < data.budgets.length; i++)
      {
        if (data.budgets[i].username == this.username)
        {
          this.budgetPosts.push(data.budgets[i]);
        }
      }
    }, 50);
    });
  }

  createNewBudgetForm()
  {
    this.form = this.formBuilder.group(
      {//validation using form builder
        budget_price: ['', Validators.compose([
          Validators.required          //name is required
        ])]
      })
  }

  onBudgetSubmit()
  {
    console.log("hi");
    this.processing = true;
    const budget = {
      username: this.username,
      budget_price: this.form.get('budget_price').value
    }

    this.productService.newBudget(budget).subscribe(data => {
      if (!data.success) {
        this.checkerClass = 'alert alert-danger';
        this.checker = data.message;
        this.processing = false;
      }else {
        this.checkerClass = 'alert alert-success';
        this.checker = data.message;
      }
    });
  } 

  getCurrentBudget()
  {
    this.currentBudget = 0;

    this.productService.getAllBudgets().subscribe(data => 
    {
      setTimeout(() =>{
      for (let i = 0; i < data.budgets.length; i++)
      {
        this.dateNow = data.budgets[i].date_now.substring(0, 7);

         if (this.dateNow == this.yearMonth)
         { 
            this.budgetID = data.budgets[i]._id;
            this.currentBudget = data.budgets[i].budget_price;

            if (this.priceSpent != data.budgets[i].budget_spent)
            {
              let budget = {
                _id: this.budgetID,
                budget_spent: this.priceSpent,
                date_now: data.budgets[i].date_now,
                budget_price: data.budgets[i].budget_price,
                username: data.budgets[i].username
              }
              this.updateBudget(budget);
            }
         }
      }
    }, 50);
    });
  }

  showAllPurchases()
  {
    if (this.showPurchases == false)
    {
      document.getElementById("purchaseHeader").innerHTML = "<span class='glyphicon glyphicon-minus'></span>&nbsp;Hide Purchases for this Month";
      this.showPurchases = true;
    }
    else
    {
      document.getElementById("purchaseHeader").innerHTML = "<span class='glyphicon glyphicon-plus'></span>&nbsp;Show Purchases for this Month";
      this.showPurchases = false;
    }
  }

  showAllOtherPurchases()
  {
    if (this.showOtherPurchases == false)
    {
      document.getElementById("purchaseHeader2").innerHTML = "<span class='glyphicon glyphicon-minus'></span>&nbsp;Hide Other Purchases";
      this.showOtherPurchases = true;
    }
    else
    {
      document.getElementById("purchaseHeader2").innerHTML = "<span class='glyphicon glyphicon-plus'></span>&nbsp;Show Other Purchases";
      this.showOtherPurchases = false;
    }
  }
  showAllBudgets()
  {
    if (this.showBudgets == false)
    {
      document.getElementById("budgetHeader").innerHTML = "<span class='glyphicon glyphicon-minus'></span>&nbsp;Hide Budgets";
      this.showBudgets = true;
    }
    else
    {
      document.getElementById("budgetHeader").innerHTML = "<span class='glyphicon glyphicon-plus'></span>&nbsp;Show Budgets";
      this.showBudgets = false;
    }
  }

  updateBudget(budget) 
  {
    console.log(budget);
    //submit updated product
    this.productService.editBudget(budget).subscribe(data => 
    {
      if (!data.success)
      {//if data processing is unsuccessful, display warning message
        this.checkerClass = 'alert alert-danger';
        this.checker = data.message;
      }
      else
      {//if data processing is successful, display success message
        this.checkerClass = 'alert alert-success';
        this.checker = data.message;
      }
    });
  }

  spending(product_price)
  {
  	this.priceSpent = (this.priceSpent + product_price);
  }

  getDate()
  {
    this.newMonth;
    this.yearMonth;
    this.month = this.currentDate.getMonth() + 1;
    this.year = this.currentDate.getFullYear();

    if (this.month.toString.length == 1)
    {
      this.yearMonth = this.year + "-0" + this.month;
    }
    else
    {
      this.yearMonth = this.year + "-" + this.month;
    }
  }
}
