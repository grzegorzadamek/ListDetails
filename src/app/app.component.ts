import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  SocialLoginModule,
  GoogleSigninButtonModule,
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser
} from '@abacritt/angularx-social-login';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    TranslateModule,
    SocialLoginModule,
    GoogleSigninButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  user: SocialUser | null = null;

  constructor(
    private _translateService: TranslateService,
    private _socialAuthService: SocialAuthService,
    private _router: Router,
    private _itemService: ItemService
  ) {
    _translateService.setDefaultLang('pl');
    _translateService.use('pl');

    this._socialAuthService.authState.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this._itemService.setUser(this.user.email);
        this._router.navigate(['/dashboard']);
      }
    });
  }

  changeLanguage(lang: string): void {
    this._translateService.use(lang);
  }

  signOut(): void {
    this._socialAuthService.signOut()
      .then(() => {
        this.user = null;
        this._router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }
}
