import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonSearchbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { MovieService } from 'src/app/services/movie.service';
import { Movie, MovieResponse } from 'src/app/models/movie.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSpinner, IonSearchbar, IonSegment, IonSegmentButton]
})
export class MoviesPage implements OnInit {

  movies: Movie[] = [];
  selectedCategory: 'popular' | 'top_rated' | 'upcoming' = 'popular';
  isLoading = true;

  //search
  searchResults: Movie[] = [];
  isSearching = false;
  showSearch = false;
  private searchSubject = new Subject<string>();

  constructor(private movieService: MovieService, private router: Router) { }

  ngOnInit() {
    this.loadMovies();

    // Debounce pro search (čeká 300ms než začne hledat)
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim().length > 0) {
        this.performSearch(query);
      } else {
        this.clearSearch();
      }
    });
  }

  loadMovies() {
  this.isLoading = true;
  
  let request: Observable<MovieResponse>;
  
  switch(this.selectedCategory) {
    case 'top_rated':
      request = this.movieService.getTopRated();
      break;
    case 'upcoming':
      request = this.movieService.getUpcoming();
      break;
    default:
      request = this.movieService.getPopular();
  }
  
  request.subscribe({
    next: (response) => {
      this.movies = response.results;
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

  openDetail(movieId: number){
    this.router.navigate(['/movie', movieId]);
  }

  getRatingPercent(rating: number): number{
    return Math.round(rating * 10);
  }

  // Search funkce
  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchSubject.next(query);
  }

  performSearch(query: string) {
    this.isSearching = true;
    this.showSearch = true;
    
    this.movieService.search(query).subscribe({
      next: (response) => {
        this.searchResults = response.results;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearching = false;
      }
    });
  }

  clearSearch() {
    this.searchResults = [];
    this.showSearch = false;
    this.isSearching = false;
  }

  onSearchCancel() {
    this.clearSearch();
  }

  // Přepínač mezi kategoriemi
  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.loadMovies();
  }

}
