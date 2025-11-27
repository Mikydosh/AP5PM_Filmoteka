import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; // Guard

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./pages/movie-detail/movie-detail.page').then( m => m.MovieDetailPage),
    canActivate: [authGuard]
  },
  {
    path: 'series/:id',
    loadComponent: () => import('./pages/series-detail/series-detail.page').then(m => m.SeriesDetailPage),
    canActivate: [authGuard]
  },
  {
    path: 'list-detail/:id',
    loadComponent: () => import('./pages/list-detail/list-detail.page').then( m => m.ListDetailPage),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  }



];
