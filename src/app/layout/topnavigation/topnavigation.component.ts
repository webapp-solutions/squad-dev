import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-topnavigation',
  templateUrl: './topnavigation.component.html',
  styleUrls: ['./topnavigation.component.css'],
})
export class TopnavigationComponent implements OnInit {
  currentUser;
  user: User

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private toastr: ToastrService

  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  ngOnInit() {
    // console.log(this.currentUser);
    this.getLoginUser();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }

  goHome() {
    this.router.navigate(['']);
  }

  getLoginUser() {
    this.userService.getUser(this.currentUser.userId).subscribe({
      next: (out) => {
        console.log('Service Response for User', out);
        if (out.status == 200 && out.user != undefined) {
          this.user = out.user;
        }
      },
      error: (error) => {
        //On Error.
        console.error('Service Failure', error);
        //Toaster Error
        this.toastr.error(error, 'Service Failure');
      },
    })
  }
}
