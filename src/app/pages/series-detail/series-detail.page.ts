import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonSpinner
} from '@ionic/angular/standalone';
import { SeriesService } from '../../services/series.service';
import { SeriesDetail, Crew } from '../../models/series.model';

@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.page.html',
  styleUrls: ['./series-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonSpinner],
})
export class SeriesDetailPage implements OnInit {
  series: SeriesDetail | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSeries(parseInt(id));
    }
  }

  loadSeries(id: number) {
    this.isLoading = true;
    this.seriesService.getDetail(id).subscribe({
      next: (series) => {
        this.series = series;
        console.log('Series data:', series);
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
}