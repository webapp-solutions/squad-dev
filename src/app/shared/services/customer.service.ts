import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";

import { Customer } from '../models/Customer';
// import { ApiResponse } from '../models/ApiResponse';
import { apiBaseUrl } from '../appConfig';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient
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
      
      this.log(`${operation} failed: ${error}`);
      
      return of(error as T);
    };
  }

  getCustomers(): Observable<any> {
    const url = this.baseUrl + "/customer";
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`${_}`)),
      catchError(this.handleError<any>("getCustomers"))
    );
  }

  getCustomer(customerId:string):Observable<any> {
    const url = `${this.baseUrl}/customer/${customerId}`;
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`Fetched Customer with CustomerId = ${customerId}`)),
      catchError(this.handleError<any>(`getCustomer id= ${customerId}`))
    );

  }

  deleteCustomer(customerId:string):Observable<any> {
    const url = `${this.baseUrl}/customer/${customerId}`;
    return this.http
    .delete<any>(url)
    .pipe(
      tap(_ => this.log(`Deleted Customer with CustomerId = ${customerId}`)),
      catchError(this.handleError<any>(`Delete Customer id= ${customerId}`))
    );

  }

  updateCustomer(reqBody): Observable<any> {
    const url = `${this.baseUrl}/customer`;
    return this.http
    .put<any>(url,reqBody,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated Customer with CustomerId ${reqBody.customer._id}`)),
      catchError(this.handleError<any>('UpdateCustomer'))
    );
  }

  addCustomer(requestBody): Observable<any>{
    const url = `${this.baseUrl}/customer`;
    return this.http
    .post<any>(url,requestBody,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added customer.`)),
      catchError(this.handleError<any>('addCustomer',{status:500}))
    );
  }


}
