import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UsersSearchResult } from '../interfaces/users-search-result';
import { User } from '../interfaces/user';
import { UserRepos } from '../interfaces/user-repos';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private httpClient: HttpClient) { }

  // Headers
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(environment.githubToken)}`
  });

  // Retrieve user by its username
  getUserByUsername(username: string): Observable<User> {
    return this.httpClient.get<User>(`${environment.apiURL}/users/${username}`, {
      headers: this.headers
    })
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  // Search users based on username, with additional query parameters
  searchByUsername(username: string, per_page: number, page: number, sort_params: any): Observable<UsersSearchResult> {
    let params = new HttpParams({
      fromObject: {
        q: username,
        per_page: per_page,
        page: page
      }
    });

    if(sort_params){
      params = params.set('sort', sort_params.sort);
      params = params.set('order', sort_params.order);
    }

    return this.httpClient.get<UsersSearchResult>(`${environment.apiURL}/search/users`, {
      params: params,
      headers: this.headers
    }).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  // Retrieve all users repos based on its username
  getReposByUsername(username: string): Observable<UserRepos> {
    return this.httpClient.get<UserRepos>(`${environment.apiURL}/users/${username}/repos`, {
      headers: this.headers
    })
      .pipe(
        retry(0),
        catchError(this.handleError)
      );
  }

  // Retrieve stars amount from http headers
  getStarsAmount(username: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiURL}/users/${username}/starred?per_page=1`,
      {
        observe: 'response',
        headers: this.headers
      }).pipe(
        catchError(this.handleError)
      );
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }
}
