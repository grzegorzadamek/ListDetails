import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, tap, switchMap, of } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _socialAuthService: SocialAuthService,
    private _router: Router,
    private http: HttpClient,
    private _authService: AuthService
  ) {}

  canActivate(): Observable<boolean> {
    return this._socialAuthService.authState.pipe(
      tap((user: SocialUser) => {
      }),
      switchMap(user => {
        if (!user) {
          this._router.navigate(['/login']);
          return of(false);
        }
        return this._authService.auth( user.email ).pipe(
          map(isAuthorized => {
            if (!isAuthorized) {
              this._router.navigate(['/login']);
            }
            return isAuthorized;
          })
        );
      })
    );
  }
}


