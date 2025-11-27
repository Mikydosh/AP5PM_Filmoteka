import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonLabel, IonText, IonSpinner, AlertController, LoadingController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonLabel, IonText, IonSpinner ]
})
export class LoginPage {
  email = '';
  password = '';
  isLogin = true; // true = login, false = register

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      this.showAlert('Chyba', 'Vyplňte email a heslo');
      return;
    }

    const loading = await this.loadingController.create({
      message: this.isLogin ? 'Přihlašování...' : 'Registrace...'
    });
    await loading.present();

    try {
      if (this.isLogin) {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.register(this.email, this.password);
      }
      
      await loading.dismiss();
      this.router.navigate(['/tabs/movies']);
    } catch (error: any) {
      await loading.dismiss();
      this.handleError(error);
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  handleError(error: any) {
    let message = 'Něco se pokazilo';
    
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Neplatný email';
        break;
      case 'auth/user-not-found':
        message = 'Uživatel neexistuje';
        break;
      case 'auth/wrong-password':
        message = 'Špatné heslo';
        break;
      case 'auth/email-already-in-use':
        message = 'Email je již registrován';
        break;
      case 'auth/weak-password':
        message = 'Heslo musí mít alespoň 6 znaků';
        break;
      case 'auth/invalid-credential':
        message = 'Neplatné přihlašovací údaje';
        break;
      default:
        message = error.message || 'Něco se pokazilo';
    }
    
    this.showAlert('Chyba', message);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Resetování hesla:
  async resetPassword() {
  const alert = await this.alertController.create({
    header: 'Obnovit heslo',
    message: 'Zadejte email pro obnovení hesla',
    inputs: [
      {
        name: 'email',
        type: 'email',
        placeholder: 'Email',
        value: this.email // předvyplň aktuální email
      }
    ],
    buttons: [
      {
        text: 'Zrušit',
        role: 'cancel'
      },
      {
        text: 'Odeslat',
        handler: async (data) => {
          if (!data.email) {
            this.showAlert('Chyba', 'Vyplňte email');
            return false;
          }
          
          try {
            await this.authService.resetPassword(data.email);
            this.showAlert('Hotovo', 'Email s odkazem pro obnovení hesla byl odeslán');
            return true;
          } catch (error: any) {
            this.handleError(error);
            return false;
          }
        }
      }
    ]
  });

  await alert.present();
}
}