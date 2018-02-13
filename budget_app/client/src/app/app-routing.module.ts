//start of module imports
import { RouterModule, Routes } from '@angular/router';  //used for array of routes
import { NgModule } from '@angular/core';                //NgModule decorator and metadata
//end of module imports
//start of component imports
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
//end of component imports

//array of angular 2 routes
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // Default Route
  },
  {
    path: 'dashboard',
    component: DashboardComponent // Dashboard Route
  },  
  {
    path: 'register',
    component: RegisterComponent // Register Route
  },  
  {
    path: 'login',
    component: LoginComponent // Login Route
  },  
  {
    path: 'profile',
    component: ProfileComponent // Login Route
  },
  { path: '**', component: HomeComponent } // Anything else Route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }
