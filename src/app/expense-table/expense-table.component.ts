import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/databse.service';
import { Category } from '../database/models/category.model';
import { Expense } from '../database/models/expenses.model';
import * as XLSX from 'xlsx';

interface DayExpense {
  day: string;
  amount: number;
}

interface CategorySummary {
  categoryId: string;
  categoryName: string;
  total: number;
  dayAmounts: { [day: string]: number };
}

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.css']
})
export class ExpenseTableComponent implements OnInit, OnDestroy {
  private userSub?: Subscription;
  isLoading = true;
  errorMessage: string | null = null;
  
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  categorySummaries: CategorySummary[] = [];
  dayTotals: { [day: string]: number } = {};
  grandTotal: number = 0;
  
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private router: Router
  ) { 
    // Initialize dayTotals with zeros
    this.weekDays.forEach(day => {
      this.dayTotals[day] = 0;
    });
  }
  
  ngOnInit(): void {
    console.log('ExpenseTableComponent initialized');
    if (!navigator.onLine) {
      this.errorMessage = 'You are offline. Please check your internet connection.';
      this.isLoading = false;
      return;
    }
    
    // Subscribe to user authentication
    this.userSub = this.authService.user.subscribe(user => {
      console.log('AuthService emitted user:', user);
      if (!user) {
        console.log('User not authenticated in ExpenseTableComponent.');
        this.isLoading = false;
        return;
      }
      
      const userId = user.id;
      const weekDates = this.getWeekDates();
      console.log('Calculated week dates:', weekDates);
      
      // For each day, get the expenses
      const expenseObservables = weekDates.map((date, index) => {
        console.log(`Fetching expenses for date ${date}...`);
        return this.databaseService.getExpensesForDate(userId, date).pipe(
          map(expenses => {
            return { 
              day: this.weekDays[index], 
              expenses: expenses 
            };
          }),
          catchError(err => {
            console.error(`Error fetching expenses for ${date}:`, err);
            return of({ day: this.weekDays[index], expenses: [] });
          })
        );
      });
      
      // Get categories too
      const categoriesObs = this.databaseService.getCategories(userId).pipe(
        catchError(err => {
          console.error('Error fetching categories:', err);
          return of([]);
        })
      );
      
      // Wait for all observables to emit data and finalize loading
      forkJoin([forkJoin(expenseObservables), categoriesObs]).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(
        ([dayExpensesArray, categories]) => {
          console.log('Day expenses received:', dayExpensesArray);
          console.log('Categories received:', categories);
          
          if (categories.length === 0) {
            this.errorMessage = 'No categories available. Please create categories first.';
            return;
          }
          
          // Initialize category summaries
          const summariesMap: { [key: string]: CategorySummary } = {};
          categories.forEach((category: Category) => {
            summariesMap[category.id] = {
              categoryId: category.id,
              categoryName: category.name,
              total: 0,
              dayAmounts: {}
            };
            
            this.weekDays.forEach(day => {
              summariesMap[category.id].dayAmounts[day] = 0;
            });
          });
          
          // Process expenses for each day
          dayExpensesArray.forEach(({ day, expenses }) => {
            // Calculate day total
            const dayTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            this.dayTotals[day] = dayTotal;
            this.grandTotal += dayTotal;
            
            // Process each expense
            expenses.forEach((expense: Expense) => {
              const categoryId = expense.categoryId;
              
              // Skip if category doesn't exist
              if (!summariesMap[categoryId]) {
                console.warn(`Expense with unknown category ID: ${categoryId}`);
                return;
              }
              
              // Add expense amount to the day
              summariesMap[categoryId].dayAmounts[day] += expense.amount;
              
              // Update category total
              summariesMap[categoryId].total += expense.amount;
            });
          });
          
          // Convert map to sorted array
          this.categorySummaries = Object.values(summariesMap)
            .filter(summary => summary.total > 0)
            .sort((a, b) => b.total - a.total);
          
          console.log('Category summaries:', this.categorySummaries);
          console.log('Day totals:', this.dayTotals);
          console.log('Grand total:', this.grandTotal);
          
          if (this.grandTotal === 0) {
            this.errorMessage = 'No expense data available for the selected week.';
          }
        },
        err => {
          console.error('Error in forkJoin subscription:', err);
          this.errorMessage = 'An error occurred while fetching expense data.';
          this.isLoading = false;
        }
      );
    });
  }
  
  ngOnDestroy(): void {
    console.log('ExpenseTableComponent is being destroyed');
    this.userSub?.unsubscribe();
  }
  
  // Helper methods
  formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }
  
  getPercentage(amount: number): number {
    return this.grandTotal > 0 ? (amount / this.grandTotal * 100) : 0;
  }
  
  getDayAmount(categoryId: string, day: string): number {
    const category = this.categorySummaries.find(c => c.categoryId === categoryId);
    return category?.dayAmounts[day] || 0;
  }
  
  /**
   * Returns an array of dates (format "YYYY-MM-DD") for the current week (Monday-Sunday)
   */
  private getWeekDates(): string[] {
    const dates: string[] = [];
    const now = new Date();
    const day = now.getDay() === 0 ? 7 : now.getDay();
    const diffToMonday = 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(this.formatDate(date));
    }
    return dates;
  }
  
  /**
   * Formats a date as "YYYY-MM-DD"
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Exports the expense data to Excel format
   */
  exportToExcel(): void {
    if (this.categorySummaries.length === 0) {
      console.warn('No data to export');
      return;
    }

    try {
      // Get date range for the file name
      const weekDates = this.getWeekDates();
      const startDate = weekDates[0];
      const endDate = weekDates[weekDates.length - 1];
      const fileName = `Weekly_Expenses_${startDate}_to_${endDate}.xlsx`;

      // Create worksheet data
      const worksheetData: any[][] = [];

      // Add header row
      const headerRow = ['Category', ...this.weekDays, 'Total'];
      worksheetData.push(headerRow);

      // Add category rows
      this.categorySummaries.forEach(category => {
        const row = [
          category.categoryName,
          ...this.weekDays.map(day => category.dayAmounts[day] > 0 ? category.dayAmounts[day] : ''),
          category.total
        ];
        worksheetData.push(row);
      });

      // Add totals row
      const totalsRow = [
        'Daily Total',
        ...this.weekDays.map(day => this.dayTotals[day] > 0 ? this.dayTotals[day] : ''),
        this.grandTotal
      ];
      worksheetData.push(totalsRow);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Category column width
        ...this.weekDays.map(() => ({ wch: 12 })), // Day columns width
        { wch: 15 } // Total column width
      ];
      worksheet['!cols'] = colWidths;

      // Apply number formatting for currency
      for (let i = 1; i < worksheetData.length; i++) {
        for (let j = 1; j < worksheetData[i].length; j++) {
          const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
          if (worksheet[cellRef] && typeof worksheet[cellRef].v === 'number') {
            worksheet[cellRef].z = '$0.00';
          }
        }
      }

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Weekly Expenses');

      // Export to file
      XLSX.writeFile(workbook, fileName);
      console.log(`Excel file exported: ${fileName}`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  }
}