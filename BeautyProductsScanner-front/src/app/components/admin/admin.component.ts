import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  routerSub!: Subscription
  title = ""

  constructor(public router:Router, public userService: UserService) { }

  ngOnInit(): void {

    this.routerSub = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.title = val.url.split('/')[2]
      }
    });

    this.title = this.router.url.split('/')[2]

    if(!this.userService.user()){
      this.userService.loadUser()
    }

    if(this.userService.user()?.role!='admin' && environment.production){
      this.router.navigate(['/'])
    }

  }

  ngOnDestroy(){
    this.routerSub.unsubscribe()
  }
}
