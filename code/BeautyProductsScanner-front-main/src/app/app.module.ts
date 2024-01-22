import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { ScanComponent } from './components/main/scan/scan.component';
import { SearchComponent } from './components/main/search/search.component';
import { AccountComponent } from './components/main/account/account.component';
import { WebcamModule } from 'ngx-webcam';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { authInterceptorProviders } from './interceptors/auth.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { ProductViewComponent } from './components/main/products/view/view.component';
import { CreateProductComponent } from './components/main/products/create/create.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminUsersComponent } from './components/admin/users/users.component';
import { AdminDashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AdminProductsComponent } from './components/admin/products/products.component';
import { AdminProductsViewComponent } from './components/admin/products/view/view.component';
import { TablePaginationComponent } from './components/utils/table-pagination/table-pagination.component';
import { AdminUserViewComponent } from './components/admin/users/view/view.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ScanComponent,
    SearchComponent,
    AccountComponent,
    LoginComponent,
    SignupComponent,
    ProductViewComponent,
    CreateProductComponent,
    AdminComponent,
    AdminUsersComponent,
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminProductsViewComponent,
    TablePaginationComponent,
    AdminUserViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebcamModule,
    NgxScannerQrcodeModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
