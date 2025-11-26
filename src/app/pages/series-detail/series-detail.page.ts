import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonSpinner, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { SeriesService } from '../../services/series.service';
import { SeriesDetail, Crew } from '../../models/series.model';
// Přidání do seznamů
import { ActionSheetController, IonButton } from '@ionic/angular/standalone';
import { StorageService } from '../../services/storage.service';
import { MediaList } from '../../models/list.model';
import { addIcons } from 'ionicons';
import { bookmark, bookmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.page.html',
  styleUrls: ['./series-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonSpinner, IonButton, IonFab, IonFabButton, IonIcon ],
})


export class SeriesDetailPage implements OnInit {
  series: SeriesDetail | null = null;
  isLoading = true;

  lists: MediaList[] = [];
  isInLists: { [listId: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private storageService: StorageService,
    private actionSheetController: ActionSheetController
  ) {
    addIcons({ bookmark, bookmarkOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSeries(parseInt(id));
    }
  }

  loadSeries(id: number) {
    this.isLoading = true;
    this.seriesService.getDetail(id).subscribe({
      next: async (series) => {
        this.series = series;
        console.log('Series data:', series);
        await this.loadLists();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading series:', error);
        this.isLoading = false;
      }
    });
  }

  getPosterUrl(path: string | null): string {
    return this.seriesService.getPosterUrl(path);
  }

  getProfileUrl(path: string | null): string {
    return this.seriesService.getProfileUrl(path);
  }

  getYear(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).getFullYear().toString();
  }

  getRatingPercent(rating: number): number {
    return Math.round(rating * 10);
  }

  getDirector(): Crew | null {
    if (!this.series?.credits?.crew) return null;
    return this.series.credits.crew.find(person => person.job === 'Director') || null;
  }

  getComposer(): Crew | null {
    if (!this.series?.credits?.crew) return null;
    return this.series.credits.crew.find(person => person.job === 'Original Music Composer') || null;
  }

  getRuntime(): string {
    if (!this.series?.episode_run_time || this.series.episode_run_time.length === 0) {
      return 'N/A';
    }
    return `${this.series.episode_run_time[0]} min`;
  }

  // Přidání do seznamu
  async loadLists() {
    this.lists = await this.storageService.getAllLists();
    
    if (this.series) {
      for (const list of this.lists) {
        this.isInLists[list.id] = await this.storageService.isInList(
          list.id,
          this.series.id,
          'series'
        );
      }
    }
  }

  async openAddToListMenu() {
    if (!this.series) return;

    const buttons = [];

    for (const list of this.lists) {
      const isInList = this.isInLists[list.id];
      buttons.push({
        text: isInList ? `✓ ${list.name}` : list.name,
        handler: async () => {
          if (isInList) {
            await this.removeFromList(list.id);
          } else {
            await this.addToList(list.id);
          }
        }
      });
    }

    buttons.push({
      text: '+ Vytvořit nový seznam',
      handler: async () => {
        await this.createAndAddToList();
      }
    });

    buttons.push({
      text: 'Zrušit',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Přidat do seznamu',
      buttons: buttons
    });

    await actionSheet.present();
  }

  async addToList(listId: string) {
    if (!this.series) return;

    await this.storageService.addToList(listId, {
      id: this.series.id,
      title: this.series.name,
      poster_path: this.series.poster_path,
      type: 'series',
      vote_average: this.series.vote_average,
      release_date: this.series.first_air_date,
      addedAt: new Date()
    });

    await this.loadLists();
  }

  async removeFromList(listId: string) {
    if (!this.series) return;

    await this.storageService.removeFromList(listId, this.series.id, 'series');
    await this.loadLists();
  }

  async createAndAddToList() {
    const { AlertController } = await import('@ionic/angular/standalone');
    const alertController = new AlertController();
    
    const alert = await alertController.create({
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
              const newList = await this.storageService.createList(data.name.trim());
              await this.addToList(newList.id);
            }
          }
        }
      ]
    });

    await alert.present();
  }
  
  // Pro plnou/obrys ikony bookmarks (v seznamech)
  isInAnyList(): boolean {
  return Object.values(this.isInLists).some(value => value === true);
}
}