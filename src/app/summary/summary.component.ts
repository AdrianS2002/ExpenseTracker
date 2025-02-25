// src/app/summary/summary.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../database/databse.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  standalone: true,
  imports: []
})
export class SummaryComponent implements OnInit, OnDestroy {
  totalAmount: number = 0;
  private userSub?: Subscription;

  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the auth state to get the user id and then fetch weekly expenses
    this.userSub = this.authService.user.subscribe(user => {
      if (user) {
        const userId = user.id;
        // Calculate start (Monday) and end (Sunday) of the current week
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
        const day = dayOfWeek === 0 ? 7 : dayOfWeek; // treat Sunday as 7
        const diffToMonday = 1 - day;
        const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        const startDate = monday.toISOString();
        const endDate = sunday.toISOString();

        this.databaseService.getWeeklyExpenses(userId, startDate, endDate)
          .pipe(
            map(expenses => expenses.reduce((sum, expense) => sum + expense.amount, 0))
          )
          .subscribe(total => {
            this.totalAmount = total;
          });
      }
    });
  }

  // Method to navigate to the expenses page
  navigateToExpenses(): void {
    this.router.navigate(['/expenses']);
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
