import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  form: any = {
    name: null,
    lastname: null,
    email: null,
    password: null,
    verifPassword: null
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isLoading = false

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, public router:Router) { }

  ngOnInit(): void {
  }
  
  submit(): void {
    const { name, lastname, email, password, verifPassword} = this.form;

    if(password != verifPassword){
      this.isSignUpFailed = true;
      this.errorMessage = "Les mots de passe ne sont pas identiques.";

      return;
    }

    this.isLoading = true;

    this.authService.signup(name, lastname, email, password).subscribe({
      next: (data)=>{
        this.isSuccessful = true;
        this.isSignUpFailed = false;

        //Login
        this.authService.login(email, password).subscribe({
          next: (data)=>{
            this.tokenStorage.saveAccessToken(data.accessToken);
            this.isLoading = false
            this.navigate();
          },
          error: (err)=>{
            this.isLoading = false
          }
        });


      },
      error: (err)=>{
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.isLoading = false
      }
    }

    );
  }

  navigate(): void {
    this.router.navigate(['/'])
  }
}
