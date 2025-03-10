import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesTrackerService } from '../expenses-tracker.service';
import { ExpenseComponent } from './expense/expense.component'; // Adjust path if necessary
import { Expense } from '../../database/models/expenses.model';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule, ExpenseComponent],
  template: `
    <div class="sorting-controls">
      <button (click)="onSortBy('date')">
        Date
        <span *ngIf="sortBy === 'date' && sortDirection === 'asc'">↑</span>
        <span *ngIf="sortBy === 'date' && sortDirection === 'desc'">↓</span>
      </button>
      <button (click)="onSortBy('name')">
        Name
        <span *ngIf="sortBy === 'name' && sortDirection === 'asc'">↑</span>
        <span *ngIf="sortBy === 'name' && sortDirection === 'desc'">↓</span>
      </button>
      <button (click)="onSortBy('amount')">
        Amount
        <span *ngIf="sortBy === 'amount' && sortDirection === 'asc'">↑</span>
        <span *ngIf="sortBy === 'amount' && sortDirection === 'desc'">↓</span>
      </button>
    </div>

    <div class="expenses-list">
      <div *ngFor="let expense of sortedExpenses; trackBy: trackByIndex">
        <app-expense
          [id]="expense.id"
          [name]="expense.name"
          [categoryId]="expense.categoryId"
          [amount]="expense.amount">
        </app-expense>
      </div>

      <!-- Total Section -->
      <div class="total-section">
        <span>Total:</span>
        <span class="total-amount">{{ expenseTrackerService.getTotalAmount()() }} $</span>
      </div>
    </div>
  `,
  styleUrls: ['./expenses-list.component.css']
})
export class ExpensesListComponent {
  constructor(public expenseTrackerService: ExpensesTrackerService) {}

  // Sorting settings:
  sortBy: 'date' | 'name' | 'amount' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc'; // default: latest added first

  // Returns a sorted copy of the expenses array
  get sortedExpenses(): Expense[] {
    const expenses = this.expenseTrackerService.getExpenses()();
    return [...expenses].sort((a, b) => {
      if (this.sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (this.sortBy === 'name') {
        return this.sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (this.sortBy === 'amount') {
        return this.sortDirection === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });
  }

  // Toggle or change sort criteria
  onSortBy(property: 'date' | 'name' | 'amount'): void {
    if (this.sortBy === property) {
      // Toggle ascending/descending order if the same property is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new sort property and default direction:
      // For dates, default to descending (latest first), for others default to ascending.
      this.sortBy = property;
      this.sortDirection = property === 'date' ? 'desc' : 'asc';
    }
    console.log(`Sorting by ${this.sortBy} in ${this.sortDirection} order`);
  }

  // trackBy function for ngFor
  trackByIndex(index: number): number {
    return index;
  }
}
