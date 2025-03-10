import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './expense/expense.component';
import { ExpensesTrackerService } from '../expenses-tracker.service';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule, ExpenseComponent],
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.css']
})
export class ExpensesListComponent {
  constructor(public expenseTrackerService: ExpensesTrackerService) {}

  trackByIndex(index: number): number {
    return index;
  }
}
