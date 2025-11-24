import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieResponse } from '../models/movie.model';
import { MovieDetail } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;
  private imageBaseUrl = environment.tmdbImageBaseUrl;

  constructor(private http: HttpClient) {}

  // HLAVNI STRANKA
  // Populární filmy
  getPopular(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=cs-CZ`
    );
  }

  // URL pro poster
  getPosterUrl(path: string | null): string {
    if (!path) return 'assets/no-image.png';
    return `${this.imageBaseUrl}/w342${path}`;
  }
  
  // DETAIL PO ROZKLIKNUTI FILMU
  getDetail(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=cs-CZ`
    );
  }
}