//start of module imports
import { BrowserModule } from '@angular/platform-browser';    //ngModule for browser
import { NgModule } from '@angular/core';                     //NgModule decorator and metadata                 
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';         //ngModule for reactive forms
import { HttpModule } from '@angular/http';                   //
import { AppRoutingModule } from './app-routing.module';      //
import { ChartsModule } from 'ng2-charts';    //module displaying charts
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
//end of module imports
//start of component imports
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';           
import { HomeComponent } from './components/home/home.component';                 
import { DashboardComponent } from './components/dashboard/dashboard.component';  
import { RegisterComponent } from './components/register/register.component'; 
import { ProfileComponent } from './components/profile/profile.component'; 
import { LoginComponent } from './components/login/login.component';   
import { ProductComponent } from './components/product/product.component';
import { EditProductComponent } from './components/product/edit-product/edit-product.component';
import { DeleteProductComponent } from './components/product/delete-product/delete-product.component';  
//end of component imports
//start of service imports
import { AuthService } from './services/auth.service';  
import { ProductService } from './services/product.service';

import { AuthGuard } from './guards/auth.guard';                    
import { NotAuthGuard } from './guards/notAuth.guard';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { FilterPipe } from './filter.pipe';
import { DeleteUserComponent } from './components/profile/delete-user/delete-user.component';
import { FooterComponent } from './components/footer/footer.component';
                   
//end of service imports 

@NgModule({//configures the injector and compiler to help organize things
  declarations: [//declares which components belong to the module
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    ProductComponent,
    EditProductComponent,
    DeleteProductComponent,
    PublicProfileComponent,
    AdminComponent,
    FilterPipe,
    DeleteUserComponent,
    FooterComponent
  ],
  imports: [//declares which modules are to be imported
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    ChartsModule,
    InfiniteScrollModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, ProductService], //dependency injection
  bootstrap: [AppComponent] //declare bootstrap
})
export class AppModule {} //exports AppModule for use elsewhere 
