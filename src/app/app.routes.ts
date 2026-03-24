import { Routes } from '@angular/router';
import { authGuard, publicGuard } from '@core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'deals',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'deals',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/deals/deal-list/deal-list.component').then(m => m.DealListComponent)
  },
  {
    path: '**',
    redirectTo: 'deals'
  }
];
