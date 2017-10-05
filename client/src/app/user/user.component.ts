import { Component, OnInit } from '@angular/core'
import { AuthService } from '../service/auth.service'
import { UserService } from '../service/user.service'
import { Router } from '@angular/router'


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user:object;
  constructor(public auth:AuthService, public userService:UserService, public router: Router ) {
    this.user = this.auth.getUser();
    this.auth.getLoginEventEmitter()
        .subscribe( user => this.user=user );
  }

  ngOnInit() {
  }

  update(user){
    this.userService.update(user)
        .subscribe(result =>
          this.router.navigate(["/id"]))
  }

  logout() {
    this.auth.logout()
        .subscribe(result =>
           this.router.navigate([""])
        );
  }

}