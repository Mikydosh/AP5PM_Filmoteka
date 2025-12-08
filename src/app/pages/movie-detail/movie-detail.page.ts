import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonSpinner, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { MovieDetail, Crew } from 'src/app/models/movie.model';
// Přidání do seznamů
import { ActionSheetController } from '@ionic/angular/standalone';
import { FirestoreService  } from '../../services/firestore.service';
import { MediaList } from '../../models/list.model';
import { addIcons } from 'ionicons';
import { bookmark, bookmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonBackButton, IonButtons, IonSpinner, IonButton, IonIcon ]
})


export class MovieDetailPage implements OnInit {
  movie: MovieDetail | null = null;
  isLoading = true;

  lists: MediaList[] = []; // pole všech seznamů
  isInLists: { [listId: string]: boolean } = {}; // kontrola pro UI, ve kterých seznamech je film

  constructor(private route: ActivatedRoute, 
    private movieService: MovieService, 
    private firestoreService: FirestoreService , 
    private actionSheetController: ActionSheetController 
  ) { 
    addIcons({ bookmark, bookmarkOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMovie(parseInt(id));
    }
  }

  loadMovie(id: number) {
    this.isLoading = true;
    this.movieService.getDetail(id).subscribe({
      next: async (movie) => {
        this.movie = movie;
        await this.loadLists();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading movie:', error);
        this.isLoading = false;
      }
    });
  }
  // Základní informační funkce
  getPosterUrl(path: string | null): string {
    return this.movieService.getPosterUrl(path);
  }

  getYear(date: string): string {
    return new Date(date).getFullYear().toString();
  }

  getRatingPercent(rating: number): number{
    return Math.round(rating * 10);
  }

  // Doplňující funkce pro osobnosti filmu
  // Režisér
  getDirector(): Crew | null {
    if (!this.movie?.credits?.crew) return null;
    return this.movie.credits.crew.find(person => person.job === 'Director') || null;
  }
  // Skladatel hudby
  getComposer(): Crew | null {
    if(!this.movie?.credits?.crew) return null;
    return this.movie?.credits?.crew.find (person => person.job === 'Original Music Composer') || null;
  }
  // Profilové obrázky
  getProfileUrl(path: string | null): string {
    return this.movieService.getProfileUrl(path);
  }


  // Přidávání do seznamů
  async loadLists() {
    this.lists = await this.firestoreService.getAllLists(); // načtení všech seznamů uživatele
    
    // Zkontroluj ve kterých seznamech už film je
    if (this.movie) {
      for (const list of this.lists) {
        // Ulož do isInLists zda je film v daném seznamu (true/false)
        this.isInLists[list.id] = await this.firestoreService.isInList(
          list.id,
          this.movie.id,
          'movie'
        );
      }
    }
  }

  async openAddToListMenu() {
    if (!this.movie) return;

    const buttons = [];

    // Přidej tlačítka pro existující seznamy
    for (const list of this.lists) {
      const isInList = this.isInLists[list.id]; // pokud je na indexu true, tak je v seznamu
      buttons.push({
        text: isInList ? `✓ ${list.name}` : list.name, // pokud je v seznamu, tak přidej fajfku
        handler: async () => {
          if (isInList) {
            await this.removeFromList(list.id); // pokud je v seznamu, tak odeber
          } else {
            await this.addToList(list.id);  // pokud není v seznamu, tak přidej
          }
        }
      });
    }

  // Tlačítko pro vytvoření nového seznamu
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
  if (!this.movie) return;

  await this.firestoreService.addToList(listId, {
    id: this.movie.id,
    title: this.movie.title,
    poster_path: this.movie.poster_path,
    type: 'movie',
    vote_average: this.movie.vote_average,
    release_date: this.movie.release_date,
    addedAt: new Date()
  });

  await this.loadLists();
}

  async removeFromList(listId: string) {
    if (!this.movie) return;

    await this.firestoreService.removeFromList(listId, this.movie.id, 'movie');
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
              const newList = await this.firestoreService.createList(data.name.trim());
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

  // VZHLED kruh
  getRatingColor(rating: number): string {
    const percent = this.getRatingPercent(rating);
    if (percent >= 85) return '#48E096';
    if (percent >= 80) return '#88DB40';
    if (percent >= 70) return '#B2DF39';
    if (percent >= 60) return '#D6E233';
    if (percent >= 50) return '#ECE430';
    if (percent >= 30) return '#D9B82F';
    if (percent >= 20) return '#B4622E';
    if (percent === 0) return 'var(--ion-color-medium)';
    return '#9E2E2E';
  }

  getRatingDashArray(rating: number): string {
    const percent = this.getRatingPercent(rating);
    const circumference = 2 * Math.PI * 16;

    if (percent === 0) {
      return `${circumference} ${circumference}`;
    }
    const dash = (percent / 100) * circumference;
    return `${dash} ${circumference}`;
  }

}
