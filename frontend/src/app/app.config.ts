import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  // Array of providers to configure the Angular application
  providers: [
    // Provides the router with the application's routing configuration
    provideRouter(routes),

    // Enables client-side hydration to improve the initial rendering experience
    provideClientHydration(),

    // Provides the HTTP client for making HTTP requests
    provideHttpClient()
  ]
};
