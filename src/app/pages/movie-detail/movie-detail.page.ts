import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonSpinner } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { MovieDetail, Crew } from 'src/app/models/movie.model';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonBackButton, IonButtons, IonSpinner]
})
export class MovieDetailPage implements OnInit {
  movie: MovieDetail | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private movieService: MovieService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMovie(parseInt(id));
    }
  }

  loadMovie(id: number) {
    this.isLoading = true;
    this.movieService.getDetail(id).subscribe({
      next: (movie) => {
        this.movie = movie;
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
}
