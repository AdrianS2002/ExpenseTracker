import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpensesTrackerService {
  private selectedDay = signal("Monday");
  private availableDays = [''];
  private unavailableDays = [''];

  constructor() { 
    this.determineAvailableDays();
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

  determineAvailableDays(): void {
    const currentDay = new Date().getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    this.availableDays = daysOfWeek.slice(0, currentDay);
    this.unavailableDays = daysOfWeek.slice(currentDay);
  }

  determineDayClass(day: string): string {
    if(this.selectedDay() === day) {
      return "selectedDay";
    }

    if(this.availableDays.includes(day)) {
      return "availableDay";
    }

    return "unavailableDay";
} 
}
