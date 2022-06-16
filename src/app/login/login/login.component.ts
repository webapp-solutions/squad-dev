import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /* #region  Global variables */
  loginForm: FormGroup;
  isSubmitted: boolean = false;
  disableSubmit: boolean = false;
  returnUrl: string;
  error = '';
  /* #endregion */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    document.body.className = "hold-transition login-page ";
    
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = '/';
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.loginForm.controls;
  }


  login() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.loginForm.value;
    // Check if form values are valid.
    if (this.loginForm.invalid) {
      console.log("Failed" + JSON.stringify(formValues));
      this.disableSubmit = false
      return;
    }

    console.log("Username",formValues.username);
    
    this.authenticationService.login(formValues.username,formValues.password)
      .pipe(first())
      .subscribe({
        next: (out) => {
          // get return url from query parameters or default to home page
          // console.log("successfull",out);
          
          this.toastr.success("Login Successfull", "Success");
          // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl('/');
        },
        error: error => {
          this.error = error;
          this.disableSubmit = false;
          //On Error.
          console.error("Service Failure", error);
          // Toaster Error
          this.toastr.error(error, "Service Failure");
          // this.loading = false;
      }
        
        
    });
  }
    

}
