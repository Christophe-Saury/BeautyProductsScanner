import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { UserEntity } from 'src/app/entities/user.entity';
import { AdminUsersService } from 'src/app/services/admin/users.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class AdminUsersComponent {

  dayjs = dayjs

  isLoading = false
  users: UserEntity[] = []

  totalCount = 0
  totalPages: number = 1
  currentPage = 1;

  constructor(private adminUsersService: AdminUsersService, public router:Router) { }

  ngOnInit(){
    this.search()
  }

  search(){
    this.isLoading = true;

    this.adminUsersService.getUsers(this.currentPage).subscribe({
      next: (data)=>{
        this.isLoading = false
        this.users = data.users
        
        this.totalPages = data.totalPages
        this.totalCount = data.totalCount
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

  onPageChange(page: number){
    this.currentPage = page
    this.search()
  }

}
