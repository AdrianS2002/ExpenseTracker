import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/databse.service';
import { PieChartComponent } from "../piechart/piechart.component";
import { ExpenseTableComponent } from "../expense-table/expense-table.component";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  standalone: true,
  imports: [PieChartComponent, ExpenseTableComponent]
})
export class SummaryComponent implements OnInit, OnDestroy {
  totalAmount = 0; // Total spent during the week
  private userSub?: Subscription;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the AuthService to get the current user.
    this.userSub = this.authService.user.subscribe(user => {
      if (!user) {
        console.log('User not authenticated. Redirecting to /auth.');
        this.router.navigate(['/auth']);
        return;
      }
      const userId = user.id;
      // Get an array of dates (YYYY-MM-DD) for the current week (Monday to Sunday)
      const weekDates = this.getWeekDates();

      // For each day, fetch expenses using getExpensesForDate
      const observables = weekDates.map(date =>
        this.databaseService.getExpensesForDate(userId, date).pipe(
          catchError(error => {
            console.error(`Error fetching expenses for ${date}:`, error);
            return of([]); // On error, return an empty array
          })
        )
      );

      // Wait for all daily expense observables to complete
      forkJoin(observables).subscribe(expensesArrays => {
        // Flatten all arrays into one list of expenses
        const allExpenses = expensesArrays.flat();
        // Sum up the amount for all expenses
        this.totalAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        console.log('Weekly total:', this.totalAmount);
      });
    });
  }

  // Navigate to the expenses page (if desired)
  navigateToExpenses(): void {
    this.router.navigate(['/expenses']);
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  /**
   * Returns an array of date strings (YYYY-MM-DD) for the current week (Monday to Sunday).
   */
  private getWeekDates(): string[] {
    const dates: string[] = [];
    const now = new Date();
    // Determine Monday of the current week.
    // getDay() returns 0 (Sun) to 6 (Sat). If today is Sunday (0), treat it as 7 for calculation.
    const day = now.getDay() === 0 ? 7 : now.getDay();
    const diffToMonday = 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    // Build the array of dates from Monday through Sunday.
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(this.formatDate(date));
    }
    return dates;
  }

  /**
   * Formats a Date object as "YYYY-MM-DD".
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
