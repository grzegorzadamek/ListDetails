// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTranslateModule } from './app/translate.config'; // Dodaj konfigurację tłumaczeń
import { AppComponent } from './app/app.component';
import { routes } from 'src/app/app.routes'; // Upewnij się, że masz konfigurację routingu

// Konfiguracja aplikacji
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    provideTranslateModule() // Dodaj konfigurację tłumaczeń
  ]
}).catch((err) => console.error(err));
