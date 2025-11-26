import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner,IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { SeriesService } from '../../services/series.service';
import { Series, SeriesResponse  } from '../../models/series.model';
import { debounceTime, distinctUntilChanged, Subject, Observable  } from 'rxjs';

@Component({
  selector: 'app-series',
  templateUrl: 'series.page.html',
  styleUrls: ['series.page.scss'],
  standalone: true,
  imports: [IonLabel, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonSearchbar, IonSegment, IonSegmentButton, IonInfiniteScroll, IonInfiniteScrollContent ]
})
export class SeriesPage implements OnInit {
  series: Series[] = [];
  selectedCategory: 'popular' | 'top_rated' | 'on_the_air' = 'popular';
  isLoading = true;

  // trackování pro infinite scroll
  currentPage = 1;
  totalPages = 1;

  //search
  searchResults: Series[] = []; 
  isSearching = false;
  showSearch = false;
  private searchSubject = new Subject<string>();

  constructor(
    private seriesService: SeriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSeries();
    
    // Debounce pro search
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

  loadSeries() {
    this.isLoading = true;
    this.currentPage = 1;
    
    let request: Observable<SeriesResponse>;
    
    switch(this.selectedCategory) {
      case 'top_rated':
        request = this.seriesService.getTopRated(this.currentPage);
        break;
      case 'on_the_air':
        request = this.seriesService.getOnTheAir(this.currentPage);
        break;
      default:
        request = this.seriesService.getPopular(this.currentPage);
    }
    
    request.subscribe({
      next: (response) => {
        this.series = response.results;
        this.totalPages = response.total_pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading series:', error);
        this.isLoading = false;
      }
    });
  }

  // Načítání dalších stránek (po 20 filmech) pro infinite scroll
  loadMoreSeries(event: any) {
    if (this.currentPage >= this.totalPages) {
      event.target.complete();
      return;
    }

    this.currentPage++;
    
    let request: Observable<SeriesResponse>;
    
    switch(this.selectedCategory) {
      case 'top_rated':
        request = this.seriesService.getTopRated(this.currentPage);
        break;
      case 'on_the_air':
        request = this.seriesService.getOnTheAir(this.currentPage);
        break;
      default:
        request = this.seriesService.getPopular(this.currentPage);
    }
    
    request.subscribe({
      next: (response) => {
        this.series = [...this.series, ...response.results];
        event.target.complete();
      },
      error: (error) => {
        console.error('Error loading more series:', error);
        event.target.complete();
      }
    });
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchSubject.next(query);
  }

  performSearch(query: string) {
    this.isSearching = true;
    this.showSearch = true;
    
    this.seriesService.search(query).subscribe({
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

  getPosterUrl(path: string | null): string {
    return this.seriesService.getPosterUrl(path);
  }

  getRatingPercent(rating: number): number {
    return Math.round(rating * 10);
  }

  openDetail(seriesId: number) {
    this.router.navigate(['/series', seriesId]);
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.loadSeries();
  }
}