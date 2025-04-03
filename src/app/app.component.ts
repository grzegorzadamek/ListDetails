import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  SocialLoginModule,
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialUser
} from '@abacritt/angularx-social-login';
import { ItemService } from 'src/app/services/item.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private translateService = inject(TranslateService);
  private socialAuthService = inject(SocialAuthService);
  private router = inject(Router);
  private itemService = inject(ItemService);
  
  user = signal<SocialUser | null>(null);

  constructor() {
    this.translateService.setDefaultLang('pl');
    this.translateService.use('pl');

    this.socialAuthService.authState
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        this.user.set(user);
        if (user) {
          this.itemService.setUser(user.email);
          this.router.navigate(['/dashboard']);
        }
      });
  }

  changeLanguage(lang: string): void {
    this.translateService.use(lang);
  }

  signOut(): void {
    this.socialAuthService.signOut()
      .then(() => {
        this.user.set(null);
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }
}
