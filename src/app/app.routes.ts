import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ExpensesTrackerComponent } from './expenses-tracker/expenses-tracker.component';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    {path: 'auth', component: AuthComponent},
    {path: 'expense-tracker', component: ExpensesTrackerComponent}
];