import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SearchComponent } from './components/main/search/search.component';
import { AccountComponent } from './components/main/account/account.component';
import { ScanComponent } from './components/main/scan/scan.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ProductViewComponent } from './components/main/products/view/view.component';
import { CreateProductComponent } from './components/main/products/create/create.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminUsersComponent } from './components/admin/users/users.component';
import { AdminDashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AdminProductsComponent } from './components/admin/products/products.component';
import { AdminProductsViewComponent } from './components/admin/products/view/view.component';
import { AdminUserViewComponent } from './components/admin/users/view/view.component';

const routes: Routes = [
  {
    path:'auth/login',
    component: LoginComponent,  
  },
  {
    path:'auth/signup',
    component: SignupComponent,  
  },
  {
    path:'',
    component: MainComponent,  
    children: [
      {
        path:'',
        component: SearchComponent,  
      },
      {
        path:'search',
        component: SearchComponent,  
      },
      {
        path:'account',
        component: AccountComponent,  
      },
      {
        path:'scan',
        component: ScanComponent,  
      },
      {
        path:'products',
        children: [
          {
            path:'create',
            component: CreateProductComponent,  
          },
          {
            path:':id',
            component: ProductViewComponent,  
          },
        ]
      },
    ]
  },
  {
    path:'admin',
    component: AdminComponent,  
    children: [
      {
        path:'',
        component: AdminDashboardComponent,  
      },
      {
        path:'dashboard',
        component: AdminDashboardComponent,  
      },
      {
        path:'users',
        component: AdminUsersComponent,  
      },
      {
        path:'users/:id',
        component: AdminUserViewComponent,  
      },
      {
        path:'products',
        component: AdminProductsComponent,  
      },
      {
        path:'products/:id',
        component: AdminProductsViewComponent,  
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
