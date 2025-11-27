import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle, IonIcon, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle, trash, moon as moonIcon, logOut, key, sunny } from 'ionicons/icons';
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
  userEmail = '';

  constructor(
    private firestoreService: FirestoreService,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ moon: moonIcon, informationCircle, trash, 'log-out-outline': logOut, 'key-outline': key, sunny });
  }

  ngOnInit() {
  // Načti email
  const user = this.authService.getCurrentUser();
  this.userEmail = user?.email || 'Nepřihlášený';

  // VÝCHOZÍ je TMAVÝ
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'false') {
    // Uživatel má SVĚTLÝ režim
    this.paletteToggle = false;
  } else {
    // Výchozí TMAVÝ režim
    this.paletteToggle = true;
  }
}

onDarkModeToggle(event: any) {
  this.paletteToggle = event.detail.checked;
  
  if (this.paletteToggle) {
    // ZAPNOUT tmavý režim
    document.documentElement.classList.add('ion-palette-dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    // VYPNOUT tmavý režim (světlý)
    document.documentElement.classList.remove('ion-palette-dark');
    localStorage.setItem('darkMode', 'false');
  }
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

async changePassword() {
  const alert = await this.alertController.create({
    header: 'Změnit heslo',
    inputs: [
      {
        name: 'newPassword',
        type: 'password',
        placeholder: 'Nové heslo (min. 6 znaků)'
      },
      {
        name: 'confirmPassword',
        type: 'password',
        placeholder: 'Potvrzení hesla'
      }
    ],
    buttons: [
      {
        text: 'Zrušit',
        role: 'cancel'
      },
      {
        text: 'Změnit',
        handler: async (data) => {
          if (!data.newPassword || data.newPassword.length < 6) {
            this.showAlert('Chyba', 'Heslo musí mít alespoň 6 znaků');
            return false;
          }
          
          if (data.newPassword !== data.confirmPassword) {
            this.showAlert('Chyba', 'Hesla se neshodují');
            return false;
          }
          
          try {
            await this.authService.changePassword(data.newPassword);
            this.showAlert('Hotovo', 'Heslo bylo úspěšně změněno');
            return true;
          } catch (error: any) {
            this.showAlert('Chyba', error.message || 'Nepodařilo se změnit heslo');
            return false;
          }
        }
      }
    ]
  });

  await alert.present();
}

async showAlert(header: string, message: string) {
  const alert = await this.alertController.create({
    header,
    message,
    buttons: ['OK']
  });
  await alert.present();
}
}