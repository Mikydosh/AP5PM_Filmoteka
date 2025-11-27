import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonSpinner, IonIcon, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { FirestoreService } from '../../services/firestore.service';
import { MediaList, MediaItem } from '../../models/list.model';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonSpinner, IonIcon ],
})
export class ListDetailPage implements OnInit {
  list: MediaList | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private alertController: AlertController
  ) {
    addIcons({ trash });
  }

  async ngOnInit() {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      await this.loadList(listId);
    }
  }

  async ionViewWillEnter() {
    // Reload
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      await this.loadList(listId);
    }
  }

  async loadList(listId: string) {
    this.isLoading = true;
    this.list = await this.firestoreService.getList(listId);
    this.isLoading = false;
  }

  openDetail(item: MediaItem) {
    if (item.type === 'movie') {
      this.router.navigate(['/movie', item.id]);
    } else {
      this.router.navigate(['/series', item.id]);
    }
  }

  async removeItem(item: MediaItem, event: Event) {
    event.stopPropagation(); // Zamezí kliknutí na celou kartu
    
    const alert = await this.alertController.create({
      header: 'Odebrat ze seznamu',
      message: `Opravdu chcete odebrat "${item.title}" ze seznamu?`,
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel'
        },
        {
          text: 'Odebrat',
          role: 'destructive',
          handler: async () => {
            if (this.list) {
              await this.firestoreService.removeFromList(this.list.id, item.id, item.type);
              await this.loadList(this.list.id);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  getRatingPercent(rating: number): number {
    return Math.round(rating * 10);
  }

  getPosterUrl(path: string | null): string {
    if (!path) return 'assets/no-image.png';
    return `https://image.tmdb.org/t/p/w342${path}`;
  }

  getYear(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).getFullYear().toString();
  }

  getType(name: string): string{
    if(name === 'movie') return 'Film';
    return 'Seriál';
  }

  // VZHLED
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
    const circumference = 2 * Math.PI * 16; // 2πr kde r=16

    if (percent === 0) {
      // Pro 0% celý kruh v šedé
      return `${circumference} ${circumference}`;
    }
    const dash = (percent / 100) * circumference;
    return `${dash} ${circumference}`;
  }
}