// src/app/translate.config.ts
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { importProvidersFrom } from '@angular/core';

// Funkcja do ładowania tłumaczeń
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Konfiguracja TranslateModule
export function provideTranslateModule() {
  return importProvidersFrom([
    TranslateModule.forRoot({
      defaultLanguage: 'pl',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ]);
}

// Konfiguracja TranslateService
export function provideTranslateService() {
  return [
    {
      provide: TranslateService,
      useFactory: (translateService: TranslateService) => {
        translateService.setDefaultLang('pl');
        translateService.use('pl');
        return translateService;
      },
      deps: [TranslateService],
    },
  ];
}
