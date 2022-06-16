import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { apiBaseUrl } from '../appConfig';

@Injectable({
  providedIn: 'root'
})
export class FileService {
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

  

  uploadFile(file): Observable<any>{
    const url = `${this.baseUrl}/file`;
    const formData: FormData = new FormData();
    formData.append('path', file.path);
    formData.append('name', file.name);
    formData.append('file', file.file);
    return this.http
    .post<any>(url,formData,{responseType: 'json'})
    .pipe(
      tap(_ => this.log(`${_.file.originalname} Uploaded`)),
      catchError(this.handleError<any>('upload File'))
    );
  }

  
  
}
