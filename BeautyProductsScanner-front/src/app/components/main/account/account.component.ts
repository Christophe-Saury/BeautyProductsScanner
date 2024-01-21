import { Component, Signal, computed, effect, signal } from '@angular/core';
import { UserEntity, UserUpdate } from 'src/app/entities/user.entity';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  editUserForm: UserUpdate = {
    lastname : this.userService.user()?.lastname ?? "",
    name : this.userService.user()?.name ?? "",
  }

  showModalEditUser = false
  showSuccessPasswordChanged = false
  showChangePasswordCollapse = false

  passwordForm = {
    password: "",
    verifPassword: ""
  }
  isPasswordUpdating = false

  constructor(public userService: UserService){
    effect(() => this.editUserForm.lastname = this.userService.user()?.lastname ?? "")
    effect(() => this.editUserForm.name = this.userService.user()?.name ?? "")
  }

  ngOnInit(){
   
  }

  saveEditUserData(){
    this.userService.updateUser(this.editUserForm).subscribe({
      next: (data)=>{
        this.userService.user.mutate(value => {
          if(value){
            value.lastname = this.editUserForm.lastname
            value.name = this.editUserForm.name
          }
        });
        this.showModalEditUser = false
      },
      error: (err)=>{

      }
    });
  }

  updatePassword(){
    this.showSuccessPasswordChanged = false
    if(this.passwordForm.password != this.passwordForm.verifPassword) return
    
    this.userService.updatePassword(this.passwordForm.password).subscribe({
      next: (data)=>{
        if(data.success){
          this.showSuccessPasswordChanged = true
        }
      },
      error: (err)=>{

      }
    });
  }



}
