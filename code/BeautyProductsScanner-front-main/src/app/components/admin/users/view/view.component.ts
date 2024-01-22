import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserEntity, UserUpdateAdmin } from 'src/app/entities/user.entity';
import { AdminUsersService } from 'src/app/services/admin/users.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class AdminUserViewComponent {
  routerSub!: Subscription
  public id: number = 0

  userEntity!: UserEntity
  formUpdate!: UserUpdateAdmin

  showPersonalData=false
  showConnectData=false
  showRoleData=false

  showModalPersonalData=false
  showModalConnectData=false
  showModalRoleData=false
  showModalResetPassword = false

  showSuccessPersonalData=false
  showSuccessConnectData=false
  showSuccessRoleData=false
  showSuccessResetPassword = false

  resetPassword = ""

  isLoading = false
  isUpdating = false

  constructor(public router:Router, public userService: AdminUsersService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.routerSub = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.id = +(this.route.snapshot.paramMap.get('id') ?? 0);
        this.getUser()
      }
    });

    this.id = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.getUser()

  }

  getUser(){
    this.userService.getUser(this.id).subscribe({
      next: (data)=>{
        if(data)
          this.userEntity = data
          this.formUpdate = {
            name: this.userEntity.name,
            lastname: this.userEntity.lastname,
            email: this.userEntity.email,
            role: this.userEntity.role
          }
      },
      error: (err)=>{

      }
    });
  }

  updatePersonalData(){
    this.showSuccessPersonalData = false
    this.userService.update(this.id, {name: this.formUpdate.name, lastname: this.formUpdate.lastname}).subscribe({
      next: (data)=>{

        if(data.success){
          this.userEntity.name = this.formUpdate.name
          this.userEntity.lastname = this.formUpdate.lastname
          this.showSuccessPersonalData = true
        }

        this.showModalPersonalData = false
        
      },
      error: (err)=>{

      }
    });
  }

  updateEmail(){
    this.showSuccessConnectData = false
    this.userService.update(this.id, {email: this.formUpdate.email}).subscribe({
      next: (data)=>{
        if(data.success){
          this.formUpdate.email = this.formUpdate.email
          this.showSuccessConnectData = true
        }

        this.showModalConnectData = false
      },
      error: (err)=>{

      }
    });
  }

  updateRole(){
    this.showSuccessRoleData = false
    this.userService.update(this.id, {role: this.formUpdate.role}).subscribe({
      next: (data)=>{
        if(data.success){
          this.formUpdate.role = this.formUpdate.role
          this.showSuccessRoleData = true
        }

        this.showModalRoleData = false
      },
      error: (err)=>{

      }
    });
  }

  generatePassword(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    const length = 20
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    this.resetPassword = randomString
  }

  resetPasswordRequest(){
    this.showSuccessResetPassword = false
    this.userService.resetPassword(this.id, this.resetPassword).subscribe({
      next: (data)=>{
        if(data.success){
          this.showSuccessResetPassword = true
        }

        this.showModalResetPassword = false
      },
      error: (err)=>{

      }
    });
  }
}
