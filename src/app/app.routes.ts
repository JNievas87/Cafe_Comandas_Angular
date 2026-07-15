import { Routes } from '@angular/router';
import { Mesas } from './mesas/mesas';
import { Menu } from './menu/menu';
import { Historial } from './historial/historial';

export const routes: Routes = [
  { path: '', redirectTo: 'mesas', pathMatch: 'full' },
  { path: 'mesas', component: Mesas },
  { path: 'menu', component: Menu },
  { path: 'historial', component: Historial },
];
