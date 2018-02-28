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
import { ProductComponent } from './components/product/product.component';
import { EditProductComponent } from './components/product/edit-product/edit-product.component';
import { DeleteProductComponent } from './components/product/delete-product/delete-product.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
//end of component imports
//start of authorisation
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
//end of authorisation

//array of angular 2 routes
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // Default Route
  },
  {
    path: 'dashboard',
    component: DashboardComponent, //dashboard Route
    canActivate: [AuthGuard]       //if user is logged in, can activate
  },  
  {
    path: 'register',
    component: RegisterComponent, //register Route
    canActivate: [NotAuthGuard]   //if user is not logged in, can activate
  },  
  {
    path: 'login',
    component: LoginComponent,     //login Route
    canActivate: [NotAuthGuard]    //if user is not logged in, can activate
  },
  {
    path: 'products',
    component: ProductComponent  //product route
  },  
  {
    path: 'edit-product/:id',
    component: EditProductComponent, //edit product route
    canActivate: [AuthGuard]       //if user is logged in, can activate
  },  
  {
    path: 'delete-product/:id',
    component: DeleteProductComponent, //delete product route
    canActivate: [AuthGuard]       //if user is logged in, can activate
  },
  {
    path: 'profile',
    component: ProfileComponent, //login Route
    canActivate: [AuthGuard]       //if user is logged in, can activate
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent, //login Route
    canActivate: [AuthGuard]       //if user is logged in, can activate
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
