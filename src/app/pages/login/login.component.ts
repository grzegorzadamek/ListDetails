import { Component } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SocialLoginModule, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [CommonModule, SocialLoginModule, GoogleSigninButtonModule, TranslateModule]
})
export class LoginComponent {
  user: SocialUser | null = null;

  constructor(private authService: SocialAuthService, private router: Router, private _translateService: TranslateService) {
      _translateService.setDefaultLang('pl');
      _translateService.use('pl');

    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
