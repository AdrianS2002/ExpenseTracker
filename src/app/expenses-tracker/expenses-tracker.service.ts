import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpensesTrackerService {
  private selectedDay = signal("Monday");
  constructor() { }

  getSelectedDay(): Signal<string> {
    return this.selectedDay;
  }

  setSelectedDay(day: string): void {
    console.log("Setting day to: ", day);
    this.selectedDay.set(day);
  }
}
