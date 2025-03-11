// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ExpensesTrackerComponent } from './expenses-tracker/expenses-tracker.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SummaryComponent } from './summary/summary.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth.guard';
import { CategoriesComponent } from './categories/categories.component';
import { WeeklyBudgetComponent } from './weekly-budget/weekly-budget.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'expenses', component: ExpensesTrackerComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'summary', component: SummaryComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'weekly-budget', component: WeeklyBudgetComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];
