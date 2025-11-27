import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle, IonIcon, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle, trash, moon as moonIcon, logOut  } from 'ionicons/icons';
import { FirestoreService } from '../../services/firestore.service';
// odhlašování
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle, IonIcon ],
})
export class SettingsPage implements OnInit {
  paletteToggle = false;
  appVersion = '1.0.0';

  constructor(
    private firestoreService: FirestoreService,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ moon: moonIcon, informationCircle, trash, 'log-out-outline': logOut });
  }

  ngOnInit() {
  // Načti uložené nastavení
  const savedMode = localStorage.getItem('darkMode');
  
  if (savedMode !== null) {
    this.paletteToggle = savedMode === 'true';
  } else {
    // Použij systémové nastavení
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.paletteToggle = prefersDark.matches;
  }
  
  this.toggleDarkPalette(this.paletteToggle);
  
  // Poslouchej změny systémového nastavení (volitelné)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDark.addEventListener('change', (mediaQuery) => {
    if (localStorage.getItem('darkMode') === null) {
      this.paletteToggle = mediaQuery.matches;
      this.toggleDarkPalette(mediaQuery.matches);
    }
  });
}

onDarkModeToggle(event: any) {
  this.paletteToggle = event.detail.checked;
  this.toggleDarkPalette(this.paletteToggle);
  localStorage.setItem('darkMode', this.paletteToggle.toString());
}

toggleDarkPalette(shouldAdd: boolean) {
  document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
}

    async showAbout() {
    const alert = await this.alertController.create({
      header: 'O aplikaci',
      message: `
        Verze: ${this.appVersion}
        
        Aplikace pro správu filmů a seriálů.
        Postaveno s Ionic & Angular.
        
        Data z TMDB API.
        Autor: Michal Dolanský
      `,
      buttons: ['OK']
    });

    await alert.present();
  }

  async clearAllData() {
    const alert = await this.alertController.create({
      header: 'Vymazat všechna data',
      message: 'Opravdu chcete vymazat všechny seznamy a uložená data? Tato akce je nevratná.',
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel'
        },
        {
          text: 'Vymazat',
          role: 'destructive',
          handler: async () => {
            // Vymaž všechny seznamy
            const lists = await this.firestoreService.getAllLists();
            for (const list of lists) {
              if (!list.isDefault) {
                await this.firestoreService.deleteList(list.id);
              } else {
                // Vyprázdni výchozí seznamy
                for (const item of list.items) {
                  await this.firestoreService.removeFromList(list.id, item.id, item.type);
                }
              }
            }

            const confirmAlert = await this.alertController.create({
              header: 'Hotovo',
              message: 'Všechna data byla vymazána.',
              buttons: ['OK']
            });

            await confirmAlert.present();
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
  const alert = await this.alertController.create({
    header: 'Odhlásit se',
    message: 'Opravdu se chcete odhlásit?',
    buttons: [
      {
        text: 'Zrušit',
        role: 'cancel'
      },
      {
        text: 'Odhlásit',
        handler: async () => {
          await this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    ]
  });

  await alert.present();
}
}