import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./pages/movie-detail/movie-detail.page').then( m => m.MovieDetailPage)
  },
  {
    path: 'series/:id',
    loadComponent: () => import('./pages/series-detail/series-detail.page').then(m => m.SeriesDetailPage)
  }

];
