import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { MovieService } from 'src/app/services/movie.service';
import { Movie } from 'src/app/models/movie.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSpinner]
})
export class MoviesPage implements OnInit {

  movies: Movie[] = [];
  isLoading = true;

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies(){
    this.isLoading = true;
    this.movieService.getPopular().subscribe({
      next: (Response) => {
        this.movies = Response.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.isLoading = false;
      }
    });
  }

  getPosterUrl(path: string | null): string {
    return this.movieService.getPosterUrl(path);
  }

}
