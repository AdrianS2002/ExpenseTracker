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
  totalAmount = 0;
  private userSub?: Subscription;

  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to AuthService.user to get the user ID
    this.userSub = this.authService.user.subscribe((user) => {
      if (!user) {
        console.log('User is not authenticated. Redirecting to login...');
        this.router.navigate(['/auth']);
        return;
      }
      const userId = user.id;
      // Calculate current week's Monday (start) and Sunday (end)
      const [startDate, endDate] = this.getWeekDateRange();

      // Fetch weekly expenses, then compute the total
      this.databaseService.getWeeklyExpenses(userId, startDate, endDate)
        .pipe(map(expenses => expenses.reduce((sum, expense) => sum + expense.amount, 0)))
        .subscribe({
          next: (sum) => {
            this.totalAmount = sum;
            console.log('Weekly total:', sum);
          },
          error: (error) => {
            console.error('Failed to load weekly expenses:', error);
          }
        });
    });
  }

  // Optional: navigate to expenses page
  navigateToExpenses(): void {
    this.router.navigate(['/expenses']);
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  /**
   * Helper to get the current week's date range.
   * Monday (start) at 00:00:00 -> Sunday (end) at 23:59:59
   */
  private getWeekDateRange(): [string, string] {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    const day = dayOfWeek === 0 ? 7 : dayOfWeek; // treat Sunday as 7
    const diffToMonday = 1 - day;

    // Monday at 00:00:00
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    // Sunday at 23:59:59
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return [monday.toISOString(), sunday.toISOString()];
  }
}
