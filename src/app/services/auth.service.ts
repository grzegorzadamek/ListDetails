import { Injectable, inject, signal, computed } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Observable, of, tap, catchError } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'https://node-listdetails.onrender.com/api/auth';
  // private authUrl = 'http://localhost:3000/api/auth';
  
  // Dependency injection using inject()
  private socialAuthService = inject(SocialAuthService);
  private httpClient = inject(HttpClient);
  
  // State management with signals
  private currentUserSignal = signal<SocialUser | null>(null);
  private authenticatedSignal = signal<boolean>(false);
  
  // Computed signals for derived state
  readonly isAuthenticatedSignal = computed(() => this.authenticatedSignal());
  readonly currentUser = computed(() => this.currentUserSignal());
  
  // Convert signal to Observable for backward compatibility
  readonly currentUser$ = toObservable(this.currentUserSignal);
  
  constructor() {
    // Subscribe to auth state changes
    this.socialAuthService.authState.subscribe((user) => {
      this.currentUserSignal.set(user);
      this.authenticatedSignal.set(!!user);
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
  
  // For backward compatibility with code that expects Observable
  getCurrentUser(): Observable<SocialUser | null> {
    return this.currentUser$;
  }
  
  // For modern code that can use signals directly
  getCurrentUserSignal(): SocialUser | null {
    return this.currentUserSignal();
  }
  
  // For backward compatibility - keeping the method name for existing code
  isAuthenticated(): boolean {
    return this.authenticatedSignal();
  }
  
  logout(): void {
    this.socialAuthService.signOut();
    this.authenticatedSignal.set(false);
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