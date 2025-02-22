import { inject, Injectable, Signal, signal } from '@angular/core';
import { DatabaseService } from '../database/databse.service';
import { Category } from '../database/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesTrackerService {
  private databaseService = inject(DatabaseService);

  private selectedDay = signal("Monday");
  private availableDays: string[] = [''];
  private unavailableDays: string[] = [''];

  private expenseCategories = signal<Category[]>([]);

  constructor() { 
    this.determineAvailableDays();
    this.fetchExpenseCategories();
  }

  getSelectedDay(): Signal<string> {
    return this.selectedDay;
  }

  setSelectedDay(day: string): void {
    if(!this.availableDays.includes(day)) {
      return;
    }

    console.log("Setting day to: ", day);
    this.selectedDay.set(day);
  }

  getAvailableDays(): string[] {
    return this.availableDays;
  }

  getUnavailableDays(): string[] {
    return this.unavailableDays;
  }

  getExpenseCategories(): Signal<Category[]> {
    console.log("Getting categories: ", this.expenseCategories());
    return this.expenseCategories;
  }

  determineAvailableDays(): void {
    const currentDay = new Date().getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    this.availableDays = daysOfWeek.slice(0, currentDay);
    this.unavailableDays = daysOfWeek.slice(currentDay);
  }

  fetchExpenseCategories(): void {
    if(!localStorage.getItem('userData')) {
      return;
    }

    const user = JSON.parse(localStorage.getItem('userData')!);
    this.databaseService.getCategories(user.id).subscribe((categories) => {
      console.log("Updating categories: ", categories);
      this.expenseCategories.set(categories);
      console.log("Updated categories signal: ", this.expenseCategories());
    } );
  }
}
