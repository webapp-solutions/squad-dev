import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { TravelGroup } from "../models/TravelGroup";
import { apiBaseUrl } from '../appConfig';

@Injectable({
  providedIn: 'root'
})
export class TravelGroupService {

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

  getCounterValue(): Observable<any> {
    const url = this.baseUrl + "/travelGroup/counter";
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`${_}`)),
      catchError(this.handleError<any>("get Counter"))
    );
    
  }

  getTravelGroups(): Observable<any> {
    const url = this.baseUrl + "/travelGroup";
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`${_}`)),
      catchError(this.handleError<any>("getTravelGroups"))
    );
    
  }

  

  getTravelGroup(travelGroupsId:string):Observable<any> {
    const url = `${this.baseUrl}/GetTravelGroupById/${travelGroupsId}`;
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`Fetched TravelGroup with TravelGroupId = ${travelGroupsId}`)),
      catchError(this.handleError<any>(`getTravelGroup id= ${travelGroupsId}`))
    );

  }

  updateTravelGroup(travelGroups:TravelGroup): Observable<any> {
    const url = `${this.baseUrl}/UpdateTravelGroup`;
    return this.http
    .put<any>(url,travelGroups,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated TravelGroup with TravelGroupId ${travelGroups._id}`)),
      catchError(this.handleError<any>('UpdateTravelGroup'))
    );
  }

  addTravelGroup(travelGroup): Observable<any>{
    const url = `${this.baseUrl}/travelGroup`;
    return this.http
    .post<any>(url,travelGroup,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added travelGroups.`)),
      catchError(this.handleError<any>('addTravelGroup'))
    );
  }

}
