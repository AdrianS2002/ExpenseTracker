import { inject, Injectable, Signal, signal } from '@angular/core';
import { DatabaseService } from '../database/databse.service';
import { Category } from '../database/models/category.model';
import { Expense } from '../database/models/expenses.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesTrackerService {
  private databaseService = inject(DatabaseService);

  private selectedDay = signal("Monday");
  private availableDays: string[] = [''];
  private unavailableDays: string[] = [''];
  private dayToDateMap = new Map<string, string>();

  private expenseCategories = signal<Category[]>([]);

  constructor() { 
    this.generateDayToDateMap();
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

  generateDayToDateMap(): void {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // Calculate the date of the most recent Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);
    sunday.setHours(0, 0, 0, 0); // Normalize time to avoid timezone issues


    for (let i = 0; i < 7; i++) {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + i);
        
        // Format date as YYYY-MM-DD (local time)
        const formattedDate = 
            `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
            `${date.getDate().toString().padStart(2, '0')}`;
        
        this.dayToDateMap.set(daysOfWeek[i], formattedDate);
    }

    console.log("Day to date map: ", this.dayToDateMap);
}

  determineAvailableDays(): void {
    const currentDay = new Date().getDay();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    this.availableDays = daysOfWeek.slice(0, currentDay);
    this.unavailableDays = daysOfWeek.slice(currentDay);
  }

  fetchExpenseCategories(): void {
    if(!localStorage.getItem('userData')) {
      console.log("User data not found!");
      return;
    }

    const user = JSON.parse(localStorage.getItem('userData')!);

    this.databaseService.getCategories(user.id).subscribe((categories) => {
      this.expenseCategories.set(categories);
    } );
  }

  addExpense(name: string, amount: number, categoryId: string): void {
    if(!localStorage.getItem('userData')) {
      console.log("User data not found!");
      return;
    }
     
    const user = JSON.parse(localStorage.getItem('userData')!);

    const expense: Omit<Expense, 'id'> = {
      name,
      amount,
      categoryId,
      date: this.dayToDateMap.get(this.selectedDay())!
    };

    this.databaseService.addExpense(user.id, expense).subscribe(() => {
      console.log("Expense added successfully!");
    });
  }
}
