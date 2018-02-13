//start of module imports
import { BrowserModule } from '@angular/platform-browser';    //ngModule for browser
import { NgModule } from '@angular/core';                     //NgModule decorator and metadata                 
import { ReactiveFormsModule } from '@angular/forms';         //ngModule for reactive forms
import { HttpModule } from '@angular/http';                   //
import { AppRoutingModule } from './app-routing.module';      //
//end of module imports
//start of component imports
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';           
import { HomeComponent } from './components/home/home.component';                 
import { DashboardComponent } from './components/dashboard/dashboard.component';  
import { RegisterComponent } from './components/register/register.component'; 
import { ProfileComponent } from './components/profile/profile.component'; 
import { LoginComponent } from './components/login/login.component';    
//end of component imports
//start of service imports
import { AuthService } from './services/auth.service';                      
//end of service imports 

@NgModule({//configures the injector and compiler to help organize things
  declarations: [//declares which components belong to the module
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent
  ],
  imports: [//declares which modules are to be imported
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [AuthService], //dependency injection
  bootstrap: [AppComponent] //declare bootstrap
})
export class AppModule {} //exports AppModule for use elsewhere 
