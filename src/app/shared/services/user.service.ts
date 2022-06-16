import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { User } from '../models/User';
import { apiBaseUrl } from '../appConfig';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  
  ) { }
  
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  private baseUrl = apiBaseUrl;

  private log(message: string) {
    console.log(message);
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      
      this.log(`${operation} failed: ${error.message}`);
      
      return of(result as T);
    };
  }

  getUsers(): Observable<any> {
    const url = this.baseUrl + "/GetUsers";
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`${_}`)),
      catchError(this.handleError<any>("getUsers"))
    );
  }

  getUser(userId:string):Observable<any> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`Fetched User with UserId = ${userId}`)),
      catchError(this.handleError<any>(`getUser id= ${userId}`))
    );

  }

  updateUser(user:User): Observable<any> {
    const url = `${this.baseUrl}/UpdateUser`;
    return this.http
    .put<any>(url,user,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated User with UserId ${user._id}`)),
      catchError(this.handleError<any>('UpdateUser'))
    );
  }

  addUser(user: User): Observable<any>{
    const url = `${this.baseUrl}/CreateUser`;
    return this.http
    .post<any>(url,user,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added user.`)),
      catchError(this.handleError<any>('addUser'))
    );
  }
}
