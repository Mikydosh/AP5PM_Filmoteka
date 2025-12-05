import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { MovieService } from 'src/app/services/movie.service';
import { Movie, MovieResponse } from 'src/app/models/movie.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSpinner, IonSearchbar, IonSegment, IonSegmentButton, IonInfiniteScroll, IonInfiniteScrollContent ]
})
export class MoviesPage implements OnInit {

  movies: Movie[] = [];
  selectedCategory: 'popular' | 'top_rated' | 'upcoming' = 'popular';
  isLoading = true;

  // trackování pro infinite scroll
  currentPage = 1;
  totalPages = 1;

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
    this.currentPage = 1;
    
    let request: Observable<MovieResponse>;
    
    switch(this.selectedCategory) {
      case 'top_rated':
        request = this.movieService.getTopRated(this.currentPage);
        break;
      case 'upcoming':
        request = this.movieService.getUpcoming(this.currentPage);
        break;
      default:
        request = this.movieService.getPopular(this.currentPage);
    }
    
    request.subscribe({
      next: (response) => {

      let movies = response.results;

      // Filtr pro upcoming
      if (this.selectedCategory === 'upcoming') {
        movies = movies.filter(m => m.vote_count === 0 || m.vote_average === 0);
      }

        this.movies = movies;
        this.totalPages = response.total_pages;
        this.isLoading = false;
        
        if (this.selectedCategory === 'upcoming' && this.movies.length < 10 && this.currentPage < this.totalPages) {
        this.loadMoreMovies();  // rekursivně načte další stránku
}
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.isLoading = false;
      }
    });
  }

  // Načítání dalších stránek (po 20 filmech) pro infinite scroll 
  loadMoreMovies(event?: any) {
    if (this.currentPage >= this.totalPages) {
      event.target.complete();
      return;
    }

    this.currentPage++;
    
    let request: Observable<MovieResponse>;
    
    switch(this.selectedCategory) {
      case 'top_rated':
        request = this.movieService.getTopRated(this.currentPage);
        break;
      case 'upcoming':
        request = this.movieService.getUpcoming(this.currentPage);
        break;
      default:
        request = this.movieService.getPopular(this.currentPage);
    }
    
    request.subscribe({
    next: (response) => {
      let newMovies = response.results;

      if (this.selectedCategory === 'upcoming') {
        newMovies = newMovies.filter(
          m => m.vote_count === 0 || m.vote_average === 0
        );
      }

      this.movies = [...this.movies, ...newMovies];
      event.target.complete();
    },
    error: () => {
      event.target.complete();
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
