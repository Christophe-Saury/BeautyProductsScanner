import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: any = {
    email: null,
    password: null
  };

  isLoading = false

  isLoggedIn = false;
  requestFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, public router:Router, public userService: UserService) { }

  ngOnInit(): void {
    this.isLoading = true
    if(this.router.url.split("?")[1] == "logout=true"){
      this.tokenStorage.clearToken()
      this.isLoading = false;
    } else {
      this.checkRefreshToken()
    }
  }

  checkRefreshToken(){
    this.isLoading = true
    const refreshToken = this.tokenStorage.getRefreshToken()
    if(refreshToken){
      this.authService.refreshToken().subscribe({
        next: (data: any)=>{

          this.tokenStorage.saveAccessToken(data.accessToken);
          this.tokenStorage.saveRefreshToken(data.refreshToken);

          this.userService.user.set(data.user)
  
          this.isLoading = false;
          this.navigate();
        },
        error: (err)=>{
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    } 
  }

  submit(): void {

    this.isLoading = true
    this.requestFailed = false

    const { email, password } = this.form;

    this.authService.login(email, password).subscribe({
      next: (data)=>{

        this.tokenStorage.saveAccessToken(data.accessToken);
        this.tokenStorage.saveRefreshToken(data.refreshToken);

        this.userService.user.set(data.user)

        this.requestFailed = false;
        this.isLoggedIn = true;

        this.isLoading = false;
        this.navigate();
      },
      error: (err)=>{
        this.errorMessage = err.error.message;
        this.requestFailed = true;
        this.isLoading = false;
      }
    });
  }

  navigate(): void {
    this.router.navigate(['/'])
  }

}
