import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'movies',
        loadComponent: () =>
          import('../pages/movies/movies.page').then((m) => m.MoviesPage),
      },
      {
        path: 'series',
        loadComponent: () =>
          import('../pages/series/series.page').then((m) => m.SeriesPage),
      },
      {
        path: 'lists',
        loadComponent: () =>
          import('../pages/lists/lists.page').then((m) => m.ListsPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/movies',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/movies',
    pathMatch: 'full',
  },
];
