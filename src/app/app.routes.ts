// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';

export const routes: Routes = [
  // Route for the summary page
  { path: 'summary', component: SummaryComponent },
  
  // Redirect empty path to summary or add your default route here
  { path: '', redirectTo: '/summary', pathMatch: 'full' },

  // Optionally add a wildcard route for a 404 page
  { path: '**', redirectTo: '/summary' }
];
