import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { ApiResponse } from '../models/ApiResponse';
import { ConsumerAccount } from '../models/ConsumerAccount';
import { apiBaseUrl } from "../appConfig";
import { Receipt } from '../models/Receipt';


@Injectable({
  providedIn: 'root'
})
export class ConsumerAccountService {

  constructor(
    private http: HttpClient,
    // private config: AppConfigService
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

  getConsumerAccounts(): Observable<ApiResponse> {
    const url = this.baseUrl + "/GetConsumerAccounts";
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`${_.message}`)),
      catchError(this.handleError<ApiResponse>("getConsumerAccounts"))
    );
  }

  getConsumerAccountById(consumerAccountId:string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/GetConsumerAccountById/?consumerAccountIdentifier=${consumerAccountId}`;
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Fetched ConsumerAccount with ConsumerAccountId = ${consumerAccountId}`)),
      catchError(this.handleError<ApiResponse>(`getConsumerAccount id= ${consumerAccountId}`))
    );

  }

  updateConsumerAccount(consumerAccount:ConsumerAccount): Observable<ApiResponse> {
    const url = `${this.baseUrl}/UpdateConsumerAccount`;
    return this.http
    .put<ApiResponse>(url,consumerAccount,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated ConsumerAccount with ConsumerAccountId ${consumerAccount.consumerAccountId}`)),
      catchError(this.handleError<any>('UpdateConsumerAccount'))
    );
  }

  addConsumerAccount(consumerAccount: ConsumerAccount): Observable<ApiResponse>{
    const url = `${this.baseUrl}/CreateConsumerAccount`;
    return this.http
    .post<ApiResponse>(url,consumerAccount,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added consumerAcount.`)),
      catchError(this.handleError<ApiResponse>('addConsumerAccount'))
    );
  }

  getConsumerAccountsByYear(year:string): Observable<ApiResponse> {
    const url = `${this.baseUrl}/GetConsumerAccountsByYear?year=${year}`;
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`${_.message}`)),
      catchError(this.handleError<ApiResponse>("getConsumerAccountsByYear"))
    );
  }

  deleteConsumerAccount(consumerAccountId:string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/DeleteConsumerAccount/?consumerAccountIdentifier=${consumerAccountId}`;
    return this.http
    .delete<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Deleted ConsumerAccount with ConsumerAccountId = ${consumerAccountId}`)),
      catchError(this.handleError<ApiResponse>(`deleteConsumerAccount id= ${consumerAccountId}`))
    );

  }

  addReceiptAmount(receipt: Receipt): Observable<ApiResponse>{
    const url = `${this.baseUrl}/addReceiptAmount`;
    return this.http
    .put<ApiResponse>(url,receipt,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added receipt amount.`)),
      catchError(this.handleError<ApiResponse>('addReceiptAmount'))
    );
  }
}
