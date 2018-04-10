import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  //allows reactive
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  chartData = //initialisating chart data
  [//data for the chart with label name
    { data: [0, 0, 0, 0], label: 'No budget yet' }
    // { data: [120, 455, 100, 340], label: 'February' },
    // { data: [45, 67, 800, 500], label: 'March' }
  ];

  chartOptions = 
  {//options for the chart
    legend: 
    {//options for legend
      labels: 
      {//options for legend labels
        fontColor: 'white'  //font colour for labels
      }
    },
    scales: 
    {//options for scales
      yAxes: 
      [{//options for yAxes
        display: true,  //display this
        ticks: 
        {//options for ticks
          fontColor: 'white'  //font colour
        }
      }],
      xAxes: 
      [{//options for xAxes
        display: true,  //display this
        ticks: 
        {//options for tickets
          fontColor: 'white'  //font colour
        }
      }]
    }
  }
  form;        //exports form
  checker;     //sends validation message
  checkerClass;   //checks validation
  processing = false;  //disable button
  productPosts = [];   //array for product post objects
  budgetPosts = [];    //array for budget post objects
  username;            //username
  priceSpent = 0;      //price user has spent on current budget
  currentBudget;       //current budget amount
  currentDate = new Date();  //current day
  dateNow;        //date converted
  yearMonth;      //month and year of date combined
  month;          //month of date
  year;          //year of date
  budgetID = 0;  //the ID of the budget
  budget;        //budget array

  constructor
  (
    private formBuilder: FormBuilder,
  	private productService: ProductService,
  	public authService: AuthService,
    private router: Router
  ) 
  { 
     this.createNewBudgetForm();
  }
  ngOnInit() 
  {//on intitialisation
  	this.authService.getProfile().subscribe(profile => 
    {//subscribe to data retrieved inside /services/auth.service
  		this.username = profile.user.username;  //grabs current users username
  	});
    this.getDate();   //get date

    this.productService.getAllBudgets().subscribe(data => 
    {//subscribe to getAllBudgets set up inside /services/product.service
      for (let i = 0; i < data.budgets.length; i++)
      {//loop through budgets
        if (data.budgets[i].username == this.username)
        {//if username linked to budget is same as logged in user, 
          this.dateNow = data.budgets[i].date_now.substring(0, 7);

          if (this.dateNow == this.yearMonth)
          {//if current date is same as budget date
            //push latest month into chartData then break from loop
            this.chartData = [];  //empty chart
            this.chartData.push({ data: [data.budgets[i].budget_price, data.budgets[i].budget_price - data.budgets[i].budget_spent], label: this.dateNow });
            break;
          }
        }
      }
    });
    this.getAllProducts();  //get all products
    this.getAllBudgets();   //get all budgets
    this.getCurrentBudget();//get current budget
  }
  getAllProducts() 
  {//get all products to display
    this.productService.getAllProducts().subscribe(data => 
    {//subscribe to data retrieved inside /services/product.service
      this.productPosts = [];
      setTimeout(() =>
      {//set a timeout of 50ms
        for (let i = 0; i < data.products.length; i++)
        {//loop through products
          if (data.products[i].createdBy == this.username)
          {//if current product is the same as the username, add product to productPosts array
            this.productPosts.push(data.products[i]);
            //get the first 8 chracters of the createdAt date and add to variable dateNow
            this.dateNow = data.products[i].createdAt.substring(0, 7);
            if (this.dateNow == this.yearMonth)
            {//if dateNow is equal to yearMonth
              //pass product_price to spending
              this.spending(data.products[i].product_price);  
            }
          }
        }
      }, 50);
    });
  }
  getAllBudgets() 
  {//get all budgets
    this.productService.getAllBudgets().subscribe(data => 
    {//subscribe to getAllBudgets set up inside /services/product.service
      this.budgetPosts = [];  //clear budgetPosts array
      setTimeout(() =>
      {//set up a timeout of 50ms
        for (let i = 0; i < data.budgets.length; i++)
        {//loop through all budgets
          if (data.budgets[i].username == this.username)
          {//if username linked to budget is same as logged in user, 
            this.budgetPosts.push(data.budgets[i]);            
          }
        }
      }, 50);
    });
  }
  createNewBudgetForm()
  {//set up for new budget form
    this.form = this.formBuilder.group(
      {//validation using form builder
        budget_price: ['', Validators.compose([
          Validators.required          //name is required
        ])]
      })
  }
  onBudgetSubmit()
  {//upon submitting budget
    this.processing = true;  //set procesing to true
    const budget = 
    {//data to add to budget [username and budget_price]
      username: this.username,
      budget_price: this.form.get('budget_price').value
    }

    this.productService.newBudget(budget).subscribe(data => 
      {//subscribe to newBudget service set up in /services/product.service
      if (!data.success) 
      {//if data retrievel unsuccessful
        this.checkerClass = 'alert alert-danger';
        this.checker = data.message;
        this.processing = false;
      }else 
      {//if data retrievel is successful
        this.checkerClass = 'alert alert-success';
        this.checker = data.message;
        this.router.navigate(['/products']); //navigate to login view
      }
    });
  } 
  getCurrentBudget()
  {//get current budget
    this.currentBudget = 0; //set current budget to zero

    this.productService.getAllBudgets().subscribe(data => 
    {//subscribe to service getAllBudgets inside services/product.service
      setTimeout(() =>
      {//set a timeout of 50ms
        for (let i = 0; i < data.budgets.length; i++)
        {//loop through budgets
          if (data.budgets[i].username == this.username)
          {//if budget contains username same as logged in user
            //set dateNow to substring of date_now inside current budget
            this.dateNow = data.budgets[i].date_now.substring(0, 7);

             if (this.dateNow == this.yearMonth)
             {//if dateNow is the same as current year and month
                //set budgetID to that of current budgets ID
                this.budgetID = data.budgets[i]._id;
                //set currentBudget to that of current budgets budget_price
                this.currentBudget = data.budgets[i].budget_price;                
                if (this.priceSpent != data.budgets[i].budget_spent)
                {//if priceSpent is not equal to the one inside current budgets
                  let budget = 
                  {//set up new object containing appended data
                    _id: this.budgetID,
                    budget_spent: this.priceSpent,
                    date_now: data.budgets[i].date_now,
                    budget_price: data.budgets[i].budget_price,
                    username: data.budgets[i].username
                  }
                  this.updateBudget(budget);  //call updateBudget, passing in budget
                }
             }
           }
        }
      }, 50);
    });
  }
  updateBudget(budget) 
  {//submit updated product
    this.productService.editBudget(budget).subscribe(data => 
    {//subscribe to editBudget service inside /services/product.service
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
  {//calculate the price spent
    //price spent equals price spent plus product_price
  	this.priceSpent = (this.priceSpent + product_price);
  }
  getDate()
  {//gets current date
    this.yearMonth;
    this.month = this.currentDate.getMonth() + 1;
    this.year = this.currentDate.getFullYear();

    if (this.month.toString.length == 1)
    {//ensures month is always 2 characters
      this.yearMonth = this.year + "-0" + this.month;
    }
    else
    {//ensures month is always 2 characters
      this.yearMonth = this.year + "-" + this.month;
    }
  }
  updateBudgetSubmit() 
  {//submit updated product
  this.productService.getAllBudgets().subscribe(data => 
  {//subscribe to getAllBudgets service inside /services/product.service
      for (let i = 0; i < data.budgets.length; i++)
      {//loop throug budgets
        this.dateNow = data.budgets[i].date_now.substring(0, 7);

        if (this.dateNow == this.yearMonth)
        {//if product date is same as current date
          //retrieve input for editing budget
          let inputValue = (document.getElementById("editBudget") as HTMLInputElement).value;

          this.budget = data.budgets[i];          //set budget to current budget
          this.budget.budget_price = inputValue;  //set budget_price to user input value

          this.productService.editBudget(this.budget).subscribe(data => 
          {//subscribe to editBudget inside /services/product.service
            if (!data.success)
            {//if data processing is unsuccessful, display warning message
              this.checkerClass = 'alert alert-danger';
              this.checker = data.message;
            }
            else
            {//if data processing is successful, display success message
              this.checkerClass = 'alert alert-success';
              this.checker = data.message;
              this.router.navigate(['/products']); //navigate to login view
            }
          });
        }
      }
  });
  }
}
