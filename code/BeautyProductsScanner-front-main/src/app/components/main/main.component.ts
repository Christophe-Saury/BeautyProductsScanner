import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  routerSub!: Subscription
  title = ""

  constructor(public router:Router, public userService: UserService) { }

  ngOnInit(): void {

    this.routerSub = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.title = val.url.split('/')[1]
      }
    });

    this.title = this.router.url.split('/')[1]

    if(!this.userService.user()){
      this.userService.loadUser()
    }

  }

  ngOnDestroy(){
    this.routerSub.unsubscribe()
  }

}
