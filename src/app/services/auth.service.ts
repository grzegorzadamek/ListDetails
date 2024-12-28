import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Item } from "src/app/models/item";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'https://node-listdetails.onrender.com/api/auth';
//   private authUrl = 'http://localhost:3000/api/auth';

  private currentUser = new BehaviorSubject<SocialUser | null>(null);
  private authenticated = false;

  constructor(
    private socialAuthService: SocialAuthService,
    private httpClient: HttpClient
    ) {
    this.socialAuthService.authState.subscribe((user) => {
      this.currentUser.next(user);
      this.authenticated = !!user;
    });
  }

  auth(email: string): Observable<boolean> {
    if (!email.trim()) {
      return of(false);
    }

    const body = { email: email };

    return this.httpClient.post<boolean>(this.authUrl, body).pipe(
      tap(items => items ?
        console.log(`found items matching "${email}"`) :
        console.log(`no items matching "${email}"`)),
      catchError(this.handleError<boolean>('searchItems', false))
    );
  }

  getCurrentUser(): Observable<SocialUser | null> {
    return this.currentUser.asObservable();
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  logout(): void {
    this.socialAuthService.signOut();
    this.authenticated = false;
  }

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(error);
        console.log(`${operation} failed: ${error.body.error}`);

        const emptyResult = result as T;
        return of(emptyResult);
      }
    }
}
