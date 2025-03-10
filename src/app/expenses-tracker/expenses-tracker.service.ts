import { inject, Injectable, Signal, signal } from '@angular/core';
import { DatabaseService } from '../database/databse.service';
import { Category } from '../database/models/category.model';
import { Expense } from '../database/models/expenses.model';
import { catchError, map, of, tap } from 'rxjs';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const DAY_NUMBER_AMERICAN_TO_EUROPEAN = [6, 0, 1, 2, 3, 4, 5] as const;
type DayOfWeek = typeof DAYS_OF_WEEK[number];

interface UserData {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpensesTrackerService {
  private readonly databaseService = inject(DatabaseService);
  showForm = signal<boolean>(false);
  // Core state
  private selectedDay = signal<DayOfWeek>('Sunday');
  private expenseCategories = signal<Category[]>([]);
  private expenses = signal<Expense[]>([]);
  private totalAmount = signal<number>(0);

  private readonly dayToDateMap = this.generateDayToDateMap();
  
  constructor() {
    this.initializeService();
  }

  // Public API

  getSelectedDay(): Signal<DayOfWeek> {
    return this.selectedDay.asReadonly();
  }

  getExpenses(): Signal<Expense[]> {
    return this.expenses.asReadonly();
  }

  getExpenseCategories(): Signal<Category[]> {
    return this.expenseCategories.asReadonly();
  }

  getAvailableDays(): DayOfWeek[] {
    const currentDay = DAY_NUMBER_AMERICAN_TO_EUROPEAN[new Date().getDay()];
    return DAYS_OF_WEEK.slice(0, currentDay + 1);
  }

  getUnavailableDays(): DayOfWeek[] {
    const currentDay = DAY_NUMBER_AMERICAN_TO_EUROPEAN[new Date().getDay()];
    return DAYS_OF_WEEK.slice(currentDay + 1);
  }

  getTotalAmount(): Signal<number> {
    return this.totalAmount.asReadonly();
  }

  setTotalAmount(amount: number): void {
    this.totalAmount.set(amount);
  }

  setSelectedDay(day: DayOfWeek): void {
    if (!this.getAvailableDays().includes(day)) {
      return;
    }
    this.selectedDay.set(day);
    this.fetchExpensesForSelectedDay();
  }

  addExpense(name: string, amount: number, categoryId: string): void {
    const userData = this.getUserData();
    if (!userData) return;

    const expense: Omit<Expense, 'id'> = {
      name,
      amount,
      categoryId,
      date: this.dayToDateMap.get(this.selectedDay()) ?? ''
    };

    this.databaseService.addExpense(userData.id, expense).pipe(
      tap(() => this.fetchExpensesForSelectedDay()),
      catchError((error) => {
        console.error('Failed to add expense:', error);
        return of(null);
      })
    ).subscribe();
  }

  deleteExpense(expenseId: string): void {
    const userData = this.getUserData();
    if (!userData) return;

    this.databaseService.deleteExpense(userData.id, expenseId).pipe(
      tap(() => this.fetchExpensesForSelectedDay()),
      catchError((error) => {
        console.error('Failed to delete expense:', error);
        return of(null);
      })
    ).subscribe();
  }

  updateExpense(expenseId: string, updatedExpense: Partial<Expense>): void {
    const userData = this.getUserData();
    if (!userData) return;

    this.databaseService.updateExpense(userData.id, expenseId, updatedExpense).pipe(
      tap(() => this.fetchExpensesForSelectedDay()),
      catchError((error) => {
        console.error('Failed to update expense:', error);
        return of(null);
      })
    ).subscribe();
  }

  // Private methods

  private initializeService(): void {
    // Rebuild the day-to-date map and fetch initial data
    this.generateDayToDateMap();
    this.fetchExpenseCategories();
    this.fetchExpensesForSelectedDay();
  }

  private fetchExpensesForSelectedDay(): void {
    const userData = this.getUserData();
    if (!userData) return;

    const date = this.dayToDateMap.get(this.selectedDay());
    if (!date) return;

    this.databaseService.getExpensesForDate(userData.id, date).pipe(
      map(expenses => this.enrichExpensesWithCategories(expenses)),
      catchError((error) => {
        console.error('Failed to fetch expenses:', error);
        return of([]);
      })
    ).subscribe(expenses => {
      this.expenses.set(expenses);
      this.computeTotalAmount(expenses);
    });
  }

  private fetchExpenseCategories(): void {
    const userData = this.getUserData();
    if (!userData) return;

    this.databaseService.getCategories(userData.id).pipe(
      catchError((error) => {
        console.error('Failed to fetch categories:', error);
        return of([]);
      })
    ).subscribe(categories => this.expenseCategories.set(categories));
  }

  private enrichExpensesWithCategories(expenses: Expense[]): Expense[] {
    return expenses.map(expense => ({
      ...expense,
      categoryName: this.getCategoryNameById(expense.categoryId)
    }));
  }

  private getCategoryNameById(categoryId: string): string {
    return this.expenseCategories()
      .find(category => category.id === categoryId)
      ?.name ?? '';
  }

  private generateDayToDateMap(): Map<DayOfWeek, string> {
    const map = new Map<DayOfWeek, string>();
    const today = new Date();
    const monday = new Date(today);
    
    monday.setDate(today.getDate() - DAY_NUMBER_AMERICAN_TO_EUROPEAN[today.getDay()]);
    monday.setHours(0, 0, 0, 0);

    DAYS_OF_WEEK.forEach((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      map.set(day, this.formatDate(date));
    });

    return map;
  }

  private computeTotalAmount(expenses: Expense[]): void {
    this.totalAmount.set(expenses.reduce((total, expense) => total + expense.amount, 0));
  }

  private formatDate(date: Date): string {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  private getUserData(): UserData | null {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
      console.warn('User data not found');
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }
}
