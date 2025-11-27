import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSpinner  } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, CommonModule, IonSpinner],
})
export class AppComponent implements OnInit {
  isAuthInitialized = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Počkej na inicializaci auth
    this.authService.authInitialized$.subscribe(initialized => {
      if (initialized) {
        this.isAuthInitialized = true;
        
        // Až teď přesměruj
        const user = this.authService.getCurrentUser();
        if (user) {
          this.router.navigate(['/tabs/movies']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
