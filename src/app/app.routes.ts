import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ExpensesTrackerComponent } from './expenses-tracker/expenses-tracker.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'auth', component: AuthComponent},
    {path: 'expense-tracker', component: ExpensesTrackerComponent}
];