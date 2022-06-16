import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { ApiResponse } from '../models/ApiResponse';
import { DeliveryMan } from '../models/DeliveryMan';
import { apiBaseUrl } from '../appConfig';


@Injectable({
  providedIn: 'root'
})
export class DeliverymanService {
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

  getDeliveryMen(): Observable<ApiResponse> {
    const url = this.baseUrl + "/GetDeliveryMans";
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`${_}`)),
      catchError(this.handleError<ApiResponse>("getDeliveryMans"))
    );
  }

  getDeliveryMan(deliveryManId:string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/GetDeliveryManById/?deliveryManIdentifier=${deliveryManId}`;
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Fetched DeliveryMan with DeliveryManId = ${deliveryManId}`)),
      catchError(this.handleError<ApiResponse>(`getDeliveryMan id= ${deliveryManId}`))
    );

  }

  updateDeliveryMan(deliveryMan:DeliveryMan): Observable<ApiResponse> {
    const url = `${this.baseUrl}/UpdateDeliveryMan`;
    return this.http
    .put<ApiResponse>(url,deliveryMan,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated DeliveryMan with DeliveryManId ${deliveryMan.deliveryManId}`)),
      catchError(this.handleError<any>('UpdateDeliveryMan'))
    );
  }

  addDeliveryMan(deliveryMan: DeliveryMan): Observable<ApiResponse>{
    const url = `${this.baseUrl}/CreateDeliveryMan`;
    return this.http
    .post<ApiResponse>(url,deliveryMan,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added deliveryman.`)),
      catchError(this.handleError<ApiResponse>('addDeliveryMan'))
    );
  }

  deleteDeliveryMan(deliveryManId:string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/DeleteDeliveryMan/?deliveryManIdentifier=${deliveryManId}`;
    return this.http
    .delete<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Deleted DeliveryMan with DeliveryManId = ${deliveryManId}`)),
      catchError(this.handleError<ApiResponse>(`deleteDeliveryMan id= ${deliveryManId}`))
    );

  }
}
