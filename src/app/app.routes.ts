import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '**', redirectTo: '' },
  { path: '', loadComponent: () => import('./components/converter').then(m => m.Converter) }
];
