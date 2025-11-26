import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Series, SeriesDetail, SeriesResponse } from '../models/series.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;
  private imageBaseUrl = environment.tmdbImageBaseUrl;

  constructor(private http: HttpClient) {}

  // Populární seriály
  getPopular(page: number = 1): Observable<SeriesResponse> {
    return this.http.get<SeriesResponse>(
      `${this.baseUrl}/tv/popular?api_key=${this.apiKey}&language=cs-CZ&page=${page}`
    );
  }

  // Top Rated
  getTopRated(page: number = 1): Observable<SeriesResponse> {
    return this.http.get<SeriesResponse>(
      `${this.baseUrl}/tv/top_rated?api_key=${this.apiKey}&language=cs-CZ&page=${page}`
    );
  }

  // On The Air - aktuálně vysílané (podobné jako Upcoming u filmů)
  getOnTheAir(page: number = 1): Observable<SeriesResponse> {
    return this.http.get<SeriesResponse>(
      `${this.baseUrl}/tv/on_the_air?api_key=${this.apiKey}&language=cs-CZ&page=${page}`
    );
  }

  // Detail seriálu
  getDetail(id: number): Observable<SeriesDetail> {
    return this.http.get<SeriesDetail>(
      `${this.baseUrl}/tv/${id}?api_key=${this.apiKey}&language=cs-CZ&append_to_response=credits`
    );
  }

  // Vyhledávání seriálů
  search(query: string): Observable<SeriesResponse> {
    return this.http.get<SeriesResponse>(
      `${this.baseUrl}/search/tv?api_key=${this.apiKey}&language=cs-CZ&query=${query}`
    );
  }

  // URL pro poster
  getPosterUrl(path: string | null): string {
    if (!path) return 'assets/no-image.png';
    return `${this.imageBaseUrl}/w342${path}`;
  }

  // URL pro profilové fotky
  getProfileUrl(path: string | null): string {
    if (!path) return 'assets/no-image.png';
    return `${this.imageBaseUrl}/w185${path}`;
  }
}