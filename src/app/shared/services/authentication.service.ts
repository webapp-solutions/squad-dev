import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/User';
import { apiBaseUrl } from '../appConfig';
import { ApiResponse } from '../models/ApiResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
   }

   httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
   public get currentUserValue(): User {
     console.log("Adding User token", this.currentUserSubject.value);
     
    return this.currentUserSubject.value;
}

login(username: string, password: string): Observable<any> {
  const url = `${apiBaseUrl}/login`;

    return this.http
    .post<any>(url, { username, password })
        .pipe(map(res => {
            // login successful if there's a jwt token in the response
            if (res && res.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                console.log("Inside Auth Service IF after login call.");
                
                var user = res;
                localStorage.setItem('user', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            console.log("Outside IF");
            
            console.log(res);
            
            return res;
        }));
}

logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
}
}
