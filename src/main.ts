import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
// HttpClient pro získání dat z API
import { provideHttpClient } from '@angular/common/http';
// Storage
import { IonicStorageModule } from '@ionic/storage-angular';
import { importProvidersFrom } from '@angular/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';


// Inicializace dark mode před startem aplikace
const savedMode = localStorage.getItem('darkMode');
if (savedMode === 'true') {
  document.documentElement.classList.add('ion-palette-dark');
} else if (savedMode === null) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (prefersDark.matches) {
    document.documentElement.classList.add('ion-palette-dark');
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    importProvidersFrom(IonicStorageModule.forRoot()),

    // fire
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
});
