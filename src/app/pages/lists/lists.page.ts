import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonSpinner, IonFab, IonFabButton, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, list, checkmarkCircle, timeOutline } from 'ionicons/icons';
import { StorageService } from '../../services/storage.service';
import { MediaList } from '../../models/list.model';

@Component({
  selector: 'app-lists',
  templateUrl: 'lists.page.html',
  styleUrls: ['lists.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonSpinner, IonFab, IonFabButton ],
})
export class ListsPage implements OnInit {
  lists: MediaList[] = [];
  isLoading = true;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ add, list, checkmarkCircle, timeOutline });
  }

  async ngOnInit() {
    await this.loadLists();
  }

  async ionViewWillEnter() {
    // Reload lists when returning to page
    await this.loadLists();
  }

  async loadLists() {
    this.isLoading = true;
    this.lists = await this.storageService.getAllLists();
    this.isLoading = false;
  }

  openList(listId: string) {
    this.router.navigate(['/list-detail', listId]);
  }

  async createNewList() {
    const alert = await this.alertController.create({
      header: 'Nový seznam',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Název seznamu'
        }
      ],
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel'
        },
        {
          text: 'Vytvořit',
          handler: async (data) => {
            if (data.name && data.name.trim().length > 0) {
              await this.storageService.createList(data.name.trim());
              await this.loadLists();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  getListIcon(listId: string): string {
    if (listId === 'watched') return 'checkmark-circle';
    if (listId === 'watchlist') return 'time-outline';
    return 'list';
  }
}